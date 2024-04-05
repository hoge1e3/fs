const dummy={dummy:true};
let fs=dummy;
const requireTries = [
    new Function(`return require("fs");`), 
    ()=>requirejs.nodeRequire("fs"), 
    ()=>global.require("fs")
];
for (let fsf of requireTries) {
    try {
        fs = fsf();
        fs.existsSync('test.txt');
        process.cwd();// fails here in NW.js Worker( fs is OK, process is absent)
        break;
    } catch (e) { console.log("FS.ERR", e);fs = dummy; }
}
module.exports=fs;