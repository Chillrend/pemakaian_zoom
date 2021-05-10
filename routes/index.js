var express = require('express');
var router = express.Router();

const storage = require('node-persist');
const rs = require('jsrsasign');
const env = require('dotenv');
const axios = require('axios');
const moment = require('moment');

router.get('/getMeetings', async function (req, res, next) {
    await storage.init();
    let jwt = await storage.getItem('zoom-jwt');

    if (jwt === undefined || jwt === null) {
        jwt = refreshJwt();
    } else if (rs.jws.JWS.verifyJWT(jwt, process.env.ZOOM_API_SECRET, {alg: ['HS256']}) !== true) {
        jwt = refreshJwt();
    }


    let events = [];


    try{
        const resp = await axios.get(`https://api.zoom.us/v2/users/${req.query.account !== undefined ? req.query.account:'pusdatin@pnj.ac.id'}/meetings?page_size=300&type=upcoming`, { headers: {"Authorization" : `Bearer ${jwt}`} });
        const meetings = resp.data.meetings;

        meetings.forEach(meeting => {
            let startTime = moment(meeting.start_time);
            let endTime = moment(startTime).add(meeting.duration, 'm');
            let meetObj = {
                id: meeting.id,
                title: meeting.topic,
                start: startTime.valueOf(),
                end: endTime.valueOf()
            }
            events.push(meetObj);
        })

    }catch (e){
        console.log(e);
        throw new Error('Failed to get events from Zoom API');
    }

    res.json(events);
});

router.get('/', async function (req, res, next){
    const scripts = [{script: 'https://cdn.jsdelivr.net/npm/fullcalendar@5.5.1/main.min.js'}, {script: '/javascripts/calendar.js'}];
    const css = [{href: 'https://cdn.jsdelivr.net/npm/fullcalendar@5.5.1/main.min.css'}];

    res.render('events', {title: 'Zoom Events PUSDATIN', scripts: scripts, css: css});
});

function refreshJwt() {
    const header = {'alg': 'HS256', 'typ': 'JWT'};
    let exp = rs.jws.IntDate.get('now + 1hour');
    let payload = {'iss': process.env.ZOOM_API_KEY, 'exp': exp};

    const jwtHead = JSON.stringify(header);
    const jwtPayload = JSON.stringify(payload);

    const jwt = rs.jws.JWS.sign('HS256', jwtHead, jwtPayload, process.env.ZOOM_API_SECRET);

    storage.setItem('zoom-jwt', jwt);

    return jwt;
}

module.exports = router;
