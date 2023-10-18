// https://www.thebluealliance.com/apidocs/v3

const axios = require("axios");
const BASE_URL = "https://www.thebluealliance.com/api/v3";

/**
 * GET /team/{team_key}/events/{year}
 * @param {string} teamKey
 * @param {string } year
 * @returns {Promise<any>}
 */
async function teamEventsYearSimple(teamKey, year) {
    const url = BASE_URL + `/team/${teamKey}/events/${year}/simple`;

    try {
        const request = await axios.get(url);

        return request.data;
    } catch (e) {
        console.error(e);
    }
}

module.exports = { teamEventsYearSimple };