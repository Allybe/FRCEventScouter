const path = require("path");
const fs = require("fs");
const axios = require("axios");

const events = require("./API/events");
const teams = require("./API/teams");

const TBA_TOKEN = "uQihl3LBhNfC9VsC41lGK7xyPAIdCWOOs4InTVfmxPPU4SL9ciW7v2CZ2V1byQsg";
const OUTPUT = path.join(__dirname + "/output");

axios.defaults.headers.common["X-TBA-Auth-Key"] = TBA_TOKEN;

const ARGS = process.argv;
// 2nd index is event key

if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT);
    console.log("Output folder created");
}

var eventKey = "2023ilch";
var year = "2023";

console.log(ARGS);

(async function () {
    var stream = fs.createWriteStream(OUTPUT + `/${eventKey}-${Date.now()}.csv`);
    //Header
    stream.write("Team Numbers, Team Names, Link, Most Recent Regionals, Rank In Most Recent Regional, Upcoming Regional, \n");
    var dataChunk = "";

    const frcTeams = await events.eventTeamsSimple(eventKey);

    for (let i = 0; i < frcTeams.length;i++) {
        dataChunk += frcTeams[i].team_number + ",";
        dataChunk += frcTeams[i].nickname + ",";
        dataChunk += `https://www.thebluealliance.com/team/${frcTeams[i].team_number}`;

        console.log(getLatestEvent(await teams.teamEventsYearSimple(frcTeams[i].key, year)));




        //console.log(dataChunk);
        //stream.write(dataChunk + "\n");
        //dataChunk = '';
    }
})();

const getLatestEvent = (eventListing) => {
    var lowestDifference = null;
    var eventIndex = 0;
    for (let i = 0; i < eventListing.length; i++) {
        const endDate = new Date(eventListing[i].endDate);
        const difference = new Date().getMilliseconds() - endDate.getMilliseconds();

        if (difference > 0) {
            if (lowestDifference) {
                lowestDifference = difference;
                eventIndex = i;
                continue
            }

            if (lowestDifference < difference) {
                lowestDifference = difference;
                eventIndex = i;
            }
        }
    }

    return eventListing[eventIndex].key;
}

