let fs = require("fs");

function existsOr(expected, fallback) {
    return fs.existsSync(expected) ? expected : fallback;
}

function relativize(pagesDir, asset) {
    return asset.replace(pagesDir, '.');
}

module.exports = {
    root: './pages',
    data: fname => {
        let uriPattern = /(.*\/pages)\/([^\/]*)\.njk$/;
        let pagesDir = fname.replace(uriPattern, "$1");
        let fileSlug = fname.replace(uriPattern, "$2");
        if (fileSlug === "index") { fileSlug = "main"; }
        let script = existsOr(`${pagesDir}/script/${fileSlug}.ts`,
                              `${pagesDir}/script/_base.ts`);
        let style = existsOr(`${pagesDir}/style/${fileSlug}.less`,
                             `${pagesDir}/script/modules/base.less`);
        return {
            currentYear: new Date().getFullYear(),
            script: relativize(pagesDir, script),
            style: relativize(pagesDir, style)
        };
    }
}

// TODO:
// api-origin (for CSP)
// get version from package.json?
