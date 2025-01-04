import readline from 'readline';

export function showSpinner(message: string) {
  const spinnerFrames = ['|', '/', '-', '\\'];
  let frameIndex = 0;
  const spinnerInterval = 100; // milliseconds
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const spinner = setInterval(() => {
    process.stdout.write(`\r${spinnerFrames[frameIndex]} ${message}`);
    frameIndex = (frameIndex + 1) % spinnerFrames.length;
  }, spinnerInterval);

  return {
    stop: () => {
      clearInterval(spinner);
      rl.close();
      process.stdout.write('\r'); // clear the line
    },
  };
}
