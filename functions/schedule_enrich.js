var utils = require("./utils")

module.exports.enrich = function (schedule, sessions) {
    schedule[Symbol.iterator] = utils.iter.bind(null, schedule)

    let result = { timeslots: {}, days: [] }
    for (var day of schedule) {
        let newTimeslots = []
        for (var slot of day.timeslots) {

            if (slot.sessions.length == 1) {
                let actualSession = sessions[slot.sessions[0][0]]
                actualSession.dateReadable = day.dateReadable
                actualSession.startTime = slot.startTime
                actualSession.endTime = slot.endTime

                slot.sessions = [actualSession]
            } else {
                var sessionObjects = []
                for (var i = 0; i < slot.sessions.length; i++) {
                    let actualSession = sessions[slot.sessions[i][0]]

                    actualSession.auditorium = day.tracks[i].title
                    actualSession.dateReadable = day.dateReadable
                    actualSession.startTime = slot.startTime
                    actualSession.endTime = slot.endTime

                    sessionObjects.push(actualSession)
                }
                slot.sessions = sessionObjects
            }

            newTimeslots.push(slot)
        }

        result.timeslots[day.date] = newTimeslots
        result.days.push({
            date: day.date,
            dateReadable: day.dateReadable
        })
    }
    return result
}