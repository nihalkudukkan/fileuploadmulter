const path = require('path')
const fs = require('fs')

let a = path.join('uploads')
console.log(a);

let b = fs.existsSync(a)
console.log(b);
