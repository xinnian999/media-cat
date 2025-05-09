const { spawn } = require('child_process');

/**
 * 启动 Vite，并在启动成功后 resolve
 */
function startUi() {
  return new Promise((resolve, reject) => {
    const vite = spawn('pnpm', ['dev:ui'], {
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    vite.stdout.setEncoding('utf8');
    vite.stderr.setEncoding('utf8');

    vite.stdout.on('data', (data) => {
      process.stdout.write(data);

      // 监听 Vite 成功启动的标志
      if (data.includes('Local:')) {
        console.log('✅ Vite 启动成功');
        resolve(); // ✅ 通知外部 await
      }
    });

    vite.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    vite.on('error', (err) => {
      reject(err); // 启动失败时 reject
    });

    vite.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Vite 进程退出，退出码 ${code}`));
      }
    });
  });
}

module.exports = startUi;