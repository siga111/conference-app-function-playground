var utils = require("./utils")

module.exports.enrich = function(speakers, tags) {
    speakers[Symbol.iterator] = utils.iter.bind(null, speakers)

    let result = {}
    for (var element of speakers) {
        utils.upgradeTags(element, tags)
    }
    return speakers
}