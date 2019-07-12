const fs = require('fs');
const path = require('path');


function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.toUpperCase().startsWith('GET')) {
            let myPath = url.substring(4);
            router.get(myPath, mapping[url])
            console.log(`register URL mapping: GET ${myPath}`)
        } else if (url.toUpperCase().startsWith('POST')) {
            let myPath = url.substring(5);
            router.post(myPath, mapping[url])
            console.log(`register URL mapping: POST ${myPath}`)
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addController(router, dir) {
    const files = fs.readdirSync(dir);
    const js_files = files.filter((f) => {
        return f.endsWith(".js");
    });
    for (const f of js_files) {
        console.log(`process constroller: ${f}...`);
        let mapping = require(path.join(dir, f));
        addMapping(router, mapping);
    }
}
module.exports = function (dir) {
    const router = require('koa-router')();
    addController(router, dir);
    return router.routes();
}
