import cluster from 'cluster'
import cfork from 'cfork'
import util from 'util'
import os from 'os'
import path from 'path'

const args = [ JSON.stringify({
    isCluster: true
}) ]

const count = os.cpus().length / 2

let readyCount = 0;

cfork({
    exec: path.join(__dirname, './worker.js'),
    args,
    count,
    silent: false,
    refork: process.env.NODE_ENV === 'production',
    windowsHide: process.platform === 'win32',
});


cluster.on('fork', worker => {
    console.warn('[%s] [worker:%d] new worker start', Date(), worker.process.pid);
});

cluster.on('disconnect', worker => {
    // @ts-ignore
    console.warn('[%s] [master:%s] wroker:%s disconnect, exitedAfterDisconnect: %s, state: %s.',Date(), process.pid, worker.process.pid, worker.exitedAfterDisconnect, worker.state);
});

cluster.on('exit', (worker, code, signal) => {
    const exitCode = worker.process.exitCode;
    // @ts-ignore
    const err = new Error(util.format('worker %s died (code: %s, signal: %s, exitedAfterDisconnect: %s, state: %s)',worker.process.pid, exitCode, signal, worker.exitedAfterDisconnect, worker.state));
    err.name = 'WorkerDiedError';
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid, err.stack);
})

cluster.on('listening', (worker, address) => {
    
    readyCount += 1;

    if (readyCount === count) {
        console.log(`app runing address http://localhost:${address.port}`)
    }
});
