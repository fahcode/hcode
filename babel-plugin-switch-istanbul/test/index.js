// const pluginTester = require('babel-plugin-tester').default;
const fs = require("fs");
const { transformSync } = require("@babel/core");
const babelPluginIstanbul = require("../lib/index");


const code = 
`var a = 17;
var b = 3;
function fn2(b) {
  console.log(b ? "1" : "2")
}
var data = 1;
if (!data || typeof data !== "object") {
  console.log("abc")
}
var dd = 1;
switch (dd) {
  case 3:
    console.log(1)
    break;
    console.log(1)
  default:
    break;
}
console.log(fn2(false))

`
const output = transformSync(code, {
  plugins: [[babelPluginIstanbul, { include: [{ file: "src/index.js", lines: [1, 2]}], cover: { function: false, branch: false, statement: true } }]]
  // plugins: [[babelPluginIstanbul, { cover: { function: true, branch: true, statement: true } }]]
})

fs.writeFileSync(process.cwd() + '/test/output.js', output.code);