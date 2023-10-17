const path = require("path");
const fs = require("fs");
const axios = require("axios");

const events = require("./API/events");

const TBA_TOKEN = "";
const OUTPUT = path.join(__dirname + "/output");

axios.defaults.headers.common["X-TBA-Auth-Key"] = TBA_TOKEN;

const ARGS = process.argv;

if (!fs.existsSync(OUTPUT)) {
    fs.mkdirSync(OUTPUT);
    console.log("Output folder created");
}

(async function () {
    const teams = await events.eventTeamsSimple(TBA_TOKEN, "2023ilch");

    for (let i = 0; i < teams.length;i++) {
        console.log(teams[i]);
    }
})();

