var utils = require("./utils")
var sessionEnrichment = require("./session_enrich")
var speakerEnrichment = require("./speakers_enrich")
var partnerEnrichment = require("./partners_enrich")
var scheduleEnrichment = require("./schedule_enrich")

var functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase);

exports.refreshSchedule = functions.https.onRequest((req, res) => {

    admin.database().ref()
        .once("value")
        .then(snapshot => {
            let partnersRaw = snapshot.child("/partners").val()
            let resorcesRaw = snapshot.child("/resources").val()
            let venuesRaw = snapshot.child("/venues").val()

            let tagsRaw = snapshot.child("/tags").val()            
            let speakersRaw = snapshot.child("/speakers").val()
            let sessionsRaw = snapshot.child("/sessions").val()
            let scheduleRaw = snapshot.child("/schedule").val()
        

            let enrichedPartners = partnerEnrichment.enrich(partnersRaw, resorcesRaw)
            let normalizedTags = utils.normalizeTags(tagsRaw)
            let enrichedSpeakers = speakerEnrichment.enrich(speakersRaw, normalizedTags)
            let enrichedSessions = sessionEnrichment.enrich(sessionsRaw, enrichedSpeakers, normalizedTags)
            
            let enrichedSchedule = scheduleEnrichment.enrich(scheduleRaw, enrichedSessions)

            return {
                speakers: enrichedSpeakers,
                sessions: enrichedSessions,
                partners: enrichedPartners,
                days: enrichedSchedule.days,
                timeslots: enrichedSchedule.timeslots,
                tags: normalizedTags,
                venues: venuesRaw
            }
        }).then(result => {
            admin.database().ref("/generated").set(result)
        }).then(snapshot => {
            res.status(200).send("Information successfully updated!");
        }).catch(reason => {
            res.status(418).send(reason.message)
        })
})



