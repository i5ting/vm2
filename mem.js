
const { vol } = require('memfs');

const fs = require('fs'); 

const { Union } = require('unionfs');

const { patchRequire } = require( 'fs-monkey');

const {NodeVM,VMScript} = require('.');

// // ufs.use(vol).use(fs)
const ufs = new Union().use(vol).use(fs);


ufs.writeFileSync('/index.js', `const debug = require('debug')('ss');debug("hi world")`);

patchRequire(vol)
patchRequire(ufs)

// console.dir(ufs.readFileSync('./mem.js').toString())
// hi world


const vm = new NodeVM({
    console: 'inherit',
    sandbox: {},
    require: {
        external: true,
        builtin: ['fs', 'path'],
        root: './',
        mock: {
            fs: {
                readFileSync: () => 'Nice try!'
            }
        }
    }
});

// vm.run('console.log(22)'); 
// 

const script = new VMScript(`const debug = require('debug')('ss');debug("hi world");require('/index'); `);
console.log(vm.run(script));
// vm.run(`const debug = require('debug')('ss');debug("hi world")`); // TypeError: process.exit is not a function

