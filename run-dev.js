const { spawn } = require('child_process');
const path = require('path');

function runService(name, dir, colorCode) {
  const isWin = process.platform === 'win32';
  const npmCmd = isWin ? 'npm.cmd' : 'npm';
  
  console.log(`Starting ${name}...`);
  const child = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, dir),
    shell: true
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.log(`[\x1b[${colorCode}m${name}\x1b[0m] ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.error(`[\x1b[31m${name} ERROR\x1b[0m] ${line}`);
    });
  });

  child.on('close', (code) => {
    console.log(`[${name}] process exited with code ${code}`);
  });
}

runService('Server', 'server', '36'); // Cyan
runService('Client', 'client', '32'); // Green
