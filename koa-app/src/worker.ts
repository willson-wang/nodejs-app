const options = JSON.parse(process.argv[2] || '{}');

(async () => {
    try {
        const { initApp } = require('./app')
        await initApp(options)
    } catch (error) {
        console.log('work run error', process.pid, error);
    }
})()

