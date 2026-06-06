const { spawn } = require('node:child_process');
const electron = require('electron');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electron, ['.'], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

const stopChild = () => {
  if (!child.killed) {
    child.kill();
  }
};

process.on('SIGINT', stopChild);
process.on('SIGTERM', stopChild);

child.on('error', (error) => {
  console.error('Failed to start Electron:', error);
  process.exitCode = 1;
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
