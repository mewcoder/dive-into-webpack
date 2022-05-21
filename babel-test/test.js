const babel = require("./babel");

const ast = babel.getAST("./es6.js");

const deps = babel.getDependencis(ast);

const code = babel.transform(ast);

console.log("ast:", ast);

console.log("deps:" + deps);

console.log("code:", code);
