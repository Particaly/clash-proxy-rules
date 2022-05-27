const child = require('child_process')

child.spawn('nest', ['start'], {
    pwd: __dirname,
    windowsHide: true
})