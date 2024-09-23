const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { ActivityType } = require("discord.js");
const { users } = require('../models');
let log = require('stratos-logger');

module.exports = (bot) => {
    const app = express();
    const PORT = process.env.port || 3001;

    app.disable("x-powered-by");

    if (config.modules.expressApi) app.listen(PORT, () => log.success(`Express server online on port ${PORT}!`));

    app.use((req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*')
        res.set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set("Access-Control-Allow-Credentials", "true");
        next();
    });

    const checkToken = (req, res, next) => {
        const token = req.headers?.authorization;
        if (!token) return res.status(401).send('Access Denied');
        jwt.verify(token, process.env.oauth_secret, (err) => {
            if (err) return res.status(400).send('Invalid token');
            next();
        });
    };

    app.get("/api/status", checkToken, (req, res) => {
        res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "../../config.json"))).status);
    });

    app.get("/api/status/set", checkToken, (req, res) => {
        const { text, type = "Watching", status = "dnd" } = req.query;
        if (!text) return res.json("Invalid Input");

        const configPath = path.join(__dirname, "../../config.json");
        const content = JSON.parse(fs.readFileSync(configPath));
        content.status = { msg: text, type, status };
        fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
        bot.user.setPresence({ activities: [{ name: text, type: ActivityType[type] }], status });
        res.json({ text, type });
    });

    app.get("/api/modules", checkToken, (req, res) => {
        res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "../../config.json"))).modules);
    });

    app.post("/api/modules/:id", checkToken, (req, res) => {
        const { value } = req.query;
        if (!value || !["true", "false"].includes(value)) return res.status(409).json({ error: 'Invalid value!' });

        const configPath = path.join(__dirname, "../../config.json");
        const data = JSON.parse(fs.readFileSync(configPath));
        if (!(req.params.id in data.modules)) return res.status(404).json({ error: 'Module Not Found!' });

        data.modules[req.params.id] = JSON.parse(value);
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
        res.json({ message: `Value for ${req.params.id} changed to ${value}` });
    });

    app.get('/api/misc', checkToken, async (req, res) => {
        const fusers = await users.findAll();
        const guilds = bot.guilds.cache.map(guild => guild.id);

        res.json({
            users: [
                { name: 'Registered Users', value: fusers.length },
                { name: 'Total Users', value: bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0) }
            ],
            discordjs: require('discord.js').version,
            uptime: moment.duration(bot.uptime).format("D [days], H [hrs], m [mins], s [secs]"),
            ping: bot.ws.ping,
            nodejs: process.version
        });
    });
};
