'use strict';
const Koa = require('koa');
const path = require('path');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const controller = require('./controllers/controller');
const nunjucks = require('nunjucks');
const port = 3000;

app.use(bodyParser());
app.use(controller(path.join(__dirname, "controllers")));
app.listen(port);

function createEnv(path, opts) {
    const autoescape = opts.autoescape === undefined ? true : opts.autoescape;
    const noCache = opts.noCache || false;
    const watch = opts.watch || false;
    const throwOnUndefined = opts.throwOnUndefined || false;
    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader('views', {
            noCache: noCache,
            watch: watch
        }), {
            autoescape: autoescape,
            throwOnUndefined: throwOnUndefined
        }
    );
    if (opts.filters) {
        for (let f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

const env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
})

console.log(`App start at port ${port}...`);

console.log(env.render('extend.html', {
    header: 'Hello',
    body: 'bla bla bla...'
}));
