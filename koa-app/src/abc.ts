const Koa = require('koa')

function sum(a: number, b: number): number {
    return a + b
}

console.log(sum(1, 2))

const app = new Koa()

app.listen('3003', () => {
        console.log(`app runing address http://localhost:3003`);
})