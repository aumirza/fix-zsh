#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import shell from 'shelljs';

const homeDir = os.homedir();
const zshHistoryPath = path.join(homeDir, '.zsh_history');
const zshHistoryBadPath = path.join(homeDir, '.zsh_history_bad');

const isWindows = os.platform() === 'win32';
try {
  if (!fs.existsSync(zshHistoryPath)) {
    console.log('No .zsh_history file found');
    process.exit(0);
  }

  fs.renameSync(zshHistoryPath, zshHistoryBadPath);
  console.log('Renamed .zsh_history to .zsh_history_bad');

  const badHistoryContent = fs.readFileSync(zshHistoryBadPath, 'utf-8');
  const printableHistoryContent = badHistoryContent
    // .replace(/:0;.*$/gm, "");
    .split('\n')
    .filter((line) => /^[\x20-\x7E]*$/.test(line))
    .join('\n');

  fs.writeFileSync(zshHistoryPath, printableHistoryContent, 'utf-8');
  console.log('Wrote printable history to .zsh_history');

  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (isWindows) console.log('Please restart your terminal to see the changes');

  const userShell = process.env.SHELL?.split(path.sep).pop();

  if (!userShell?.includes('zsh')) {
    console.log('Hot reload not supported for this shell');
    console.log('Please restart your terminal to see the changes');
    process.exit(0);
  }

  r1.question(
    'Would you like to reload history now? [Yes/y] to confirm \n',
    (answer) => {
      if (['yes', 'y'].includes(answer.trim().toLowerCase())) {
        shell.exec('fc -R', (error, stdout, stderr) => {
          if (error) {
            console.error('Error reloading history: ', error);
          }
          if (stderr) {
            console.error('Standard error: ', stderr);
          } else {
            console.log('Standard output: ', stdout);
            console.log('History reloaded successfully');
          }
        });
      } else {
        console.log(
          'Reload skipped, Please restart your terminal to see the changes.',
        );
      }
      r1.close();
      process.exit(0);
    },
  );
} catch (error) {
  console.error('Error: ', error);
}
