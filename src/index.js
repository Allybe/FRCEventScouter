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
const eventKey = "2023ilch";
const year = "2023";

var cachedRankInfo = new Map();

if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT);
    console.log("Output folder created");
}



(async function () {
    const stream = fs.createWriteStream(OUTPUT + `/${eventKey}-${Date.now()}.csv`);
    stream.write("Team Numbers, Team Names, Link, Upcoming Regional, Most Recent Regional, Rank In Most Recent Regional, Offensive Power Rating In Most Recent Regional, \n");

    const frcTeams = await events.eventTeamsSimple(eventKey);

    for (let i = 0; i < frcTeams.length;i++) {
        await createAndWriteTeamString(stream, frcTeams[i]);
    }
})();

const createAndWriteTeamString = async (writeStream, team) => {
    let dataChunk = "";
    dataChunk += team.team_number + ",";
    dataChunk += team.nickname + ",";
    dataChunk += `https://www.thebluealliance.com/team/${team.team_number}` + ", ";

    const teamEvents = await teams.teamEventsYearSimple(team.key, year);
    const impendingEventIndex = getImpendingEventIndex(teamEvents);
    const latestEventIndex = getLatestEventIndex(teamEvents);

    dataChunk += (impendingEventIndex == -1) ? "No upcoming events," : teamEvents[impendingEventIndex].name + ",";
    dataChunk += (latestEventIndex == -1) ? "No previous events this year, No previous event to get rank, No previous event to get OPR" : teamEvents[latestEventIndex].name + ",";

    if (!cachedRankInfo.has(teamEvents[latestEventIndex].key)) {
        cacheMatchRankingInfo(formatRankings(await events.eventRankings(teamEvents[latestEventIndex].key)), teamEvents[latestEventIndex].key);
    }

    dataChunk += (cachedRankInfo.get(teamEvents[latestEventIndex].key).has(team.key)) ? `Rank ${cachedRankInfo.get(teamEvents[latestEventIndex].key).get(team.key).rank}` + "," : "This team has no ranking for their most recent regional";

    writeStream.write(dataChunk + "\n");
}

const getLatestEventIndex = (eventListing) => {
    let lowestDifference = null;
    let eventIndex = -1;
    for (let i = 0; i < eventListing.length; i++) {
        const endDate = new Date(eventListing[i].end_date);
        const difference = new Date() - endDate;

        if (difference > 0) {
            if (lowestDifference == null) {
                lowestDifference = difference;
                eventIndex = i;
            }

            if (lowestDifference > difference) {
                lowestDifference = difference;
                eventIndex = i;
            }
        }
    }

    return eventIndex;
}

const getImpendingEventIndex = (eventListing) => {
    let lowestDifference = null;
    let eventIndex = -1;
    for (let i = 0; i < eventListing.length; i++) {
        const endDate = new Date(eventListing[i].end_date);
        const difference = new Date() - endDate;

        if (difference < 0) {
            if (lowestDifference == null) {
                lowestDifference = difference;
                eventIndex = i;
            }

            if (lowestDifference > difference) {
                lowestDifference = difference;
                eventIndex = i;
            }
        }
    }

    return eventIndex;
}

const formatRankings = (eventRankInfo) => {
    let eventRankings = eventRankInfo.rankings;
    let formattedRankings = new Map();
    formattedRankings.set("sortOrderDefinitions", eventRankInfo.sort_order_info);

    for (let i = 0; i < eventRankings.length; i++) {
        let newRanking = {
            rank: eventRankings[i].rank,
            totalRankingPoints: eventRankings[i].extra_stats[0],
            matchStatus: {
                losses: eventRankings[i].losses,
                ties: eventRankings[i].ties,
                wins: eventRankings[i].wins
            },
            sortOrder: eventRankings[i].sort_orders,
            numberOfDisqualifiedMatchs: eventRankings[i].dq,
            matchesPlayed: eventRankings[i].matches_played,
        }
        formattedRankings.set(eventRankings[i].team_key, newRanking);
    }
    return formattedRankings;
}

const cacheMatchRankingInfo = (eventRankInfo, eventKey) => {
    cachedRankInfo.set(eventKey, eventRankInfo);
}

