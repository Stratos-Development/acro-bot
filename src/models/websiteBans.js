// models/website_bans.js
const {DataTypes} = require("sequelize")
const {mDB} =  require("../db.js")

const WebsiteBans = mDB.define('website_bans', {
    ban_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banned_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banned_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unban_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ban_data: {
        type: DataTypes.TEXT('long'),
        defaultValue: "No extra data provided by the admin"
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1, 2, 3]]
        }
    },
    status_data: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "No extra information provided"
    },
    developer_notes: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
}, {
    timestamps: false,
}
);
module.exports = WebsiteBans;

