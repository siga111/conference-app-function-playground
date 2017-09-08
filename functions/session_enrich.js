var utils = require("./utils")

module.exports.enrich = function (sessions, speakers, tags) {
    sessions[Symbol.iterator] = utils.iter.bind(null, sessions)

    let result = {}
    for (var element of sessions) {
        utils.upgradeTags(element, tags)
        result[element.id] = upgradeSpeaker(element, speakers)
    }
    return result
}

// Speaker object upgrade
function upgradeSpeaker(session, speakers) {
    if (hasSpeaker(session)) {
        let speakerFull = speakers[session.speakers[0]]
        if (speakerFull !== undefined) {
            session.speaker = prepareShortSpeakerObject(speakerFull)
        }
        delete session.speakers
    }
    return session
}

function hasSpeaker(session) {
    return session.speakers !== undefined && session.speakers instanceof Array
}

function prepareShortSpeakerObject(speaker) {
    // mandatory fields
    let result = {
        id: speaker.id,
        name: speaker.name,
        photeoUrl: speaker.photoUrl
    }
    // Optional fields
    if (speaker.company !== undefined) { result["company"] = speaker.company }
    if (speaker.title !== undefined) { result["title"] = speaker.title }
    return result
}