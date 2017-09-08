var _this = this

module.exports.iter = function* (o) {
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
        yield o[keys[i]];
    }
}

module.exports.normalize = function (string) {
    return string.replace(/\s/g, "").replace(/-/g, "").toLowerCase().trim()
}

module.exports.normalizeTags = function (tags) {
    tags[Symbol.iterator] = _this.iter.bind(null, tags)

    let result = {}
    for (var tag of tags) {
        let key = Object.keys(tag)[0]
        result[_this.normalize(key)] = _this.normalize(tag[key])
    }
    return result
}

module.exports.upgradeTags = function (target, tags) {
    if (hasTags(target)) {
        let newTags = []
        for (var tag of target.tags) {
            let tagColor = tags[_this.normalize(tag)]
            if (tagColor == undefined) {
                tagColor = tags["general"]
            }
            newTags.push({ title: tag, color: tagColor })
        }
        delete target.tags
        target.tags = newTags
    }
}

function hasTags(target) {
    return target.tags !== undefined && target.tags instanceof Array
}