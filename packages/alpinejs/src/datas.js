
let datas = {}

export function data(name, callback) {
    datas[name] = callback
}

export function getNamedDataProvider(name) {
    return datas[name]
}
