const { DataTypes } = require("sequelize");
const {pgDB} = require("../db");

const User = pgDB.define("User", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    ticketban: { type: DataTypes.BOOLEAN, defaultValue: false },
    ticketban_reason: { type: DataTypes.STRING, defaultValue: 'null' },
    blacklisted: { type: DataTypes.BOOLEAN, defaultValue: false },
    blacklisted_reason: { type: DataTypes.STRING, defaultValue: 'null' },
    dmblacklisted: { type: DataTypes.BOOLEAN, defaultValue: false },
    dmblacklisted_reason: { type: DataTypes.STRING, defaultValue: 'null' },
    developer: { type: DataTypes.BOOLEAN, defaultValue: false },
    badges: { type: DataTypes.ARRAY(DataTypes.STRING) },
    customer: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
