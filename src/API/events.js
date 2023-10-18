// https://www.thebluealliance.com/apidocs/v3

const axios = require("axios");
const BASE_URL = "https://www.thebluealliance.com/api/v3";

// GET /event/{event_key}/teams/simple
async function eventTeamsSimple(eventKey) {
    const url = BASE_URL + `/event/${eventKey}/teams/simple`;

    try {
        const request = await axios.get(url);
        return request.data;
    } catch (e) {
        console.error(e);
    }
}

module.exports = { eventTeamsSimple };