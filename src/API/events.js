// https://www.thebluealliance.com/apidocs/v3

const axios = require("axios");
const BASE_URL = "https://www.thebluealliance.com/api/v3";

/**
 * GET /event/{event_key}/teams/simple
 * @param {string} eventKey
 * @returns {Promise<any>}
 */
async function eventTeamsSimple(eventKey) {
    const url = BASE_URL + `/event/${eventKey}/teams/simple`;

    try {
        const request = await axios.get(url);
        return request.data;
    } catch (e) {
        console.error(e);
    }
}

/**
 * GET /event/{event_key}/oprs
 * @param {string} eventKey
 * @returns {Promise<void>}
 */
async function eventORPS(eventKey) {
    const url = BASE_URL + `/event/${eventKey}/oprs`;

    try {
        const request = await axios.get(url);
        return request.data;
    } catch (e) {
        console.error(e);
    }
}

/**
 * GET /event/{event_key}/rankings
 * @param {string} eventKey
 * @returns {Promise<void>}
 */
async function eventRankings(eventKey) {
    const url = BASE_URL + `/event/${eventKey}/rankings`;

    try {
        const request = await axios.get(url);
        return request.data;
    } catch (e) {
        console.error(e);
    }
}


module.exports = { eventTeamsSimple, eventORPS, eventRankings };