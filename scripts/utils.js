let DotJson = require('dot-json');
let { exec } = require('child_process')

module.exports.runFromPackage = function (package, command) {
    exec(command, { cwd: __dirname+'/../packages/'+package })
}

module.exports.run = function (command) {
    exec(command, { cwd: __dirname+'/..' })
}

module.exports.writeToPackageDotJson = function (package, key, value) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    dotJson.set(key, value).save()
}

module.exports.getFromPackageDotJson = function (package, key) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    return dotJson.get(key)
}

module.exports.ask = async function (message, callback) {
    let readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    readline.question(message, answer => {
        if (['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer)) callback()

        readline.close()
    })
}
