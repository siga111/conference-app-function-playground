//var utils = require("./utils")

module.exports.enrich = function (partners, resources) {
    let result = []
    for (var element of partners) {
        let title = resources[element.title]
        element.title = title

        delete element.titleClass
        result.push(element)
    }
    return result
}