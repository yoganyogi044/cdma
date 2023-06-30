
'use strict';
const Sequelize = require('sequelize')

// Import sequelize object,
// Database connection pool managed by Sequelize.
const sequelize = require('../database/postgreSQL.js')

// Define method takes two arguments
// 1st - name of table
// 2nd - columns inside the table
const SQLQuery = sequelize.define('BirthCertificate', {

    // Column-1, user_id is an object with
    // properties like type, keys,
    // validation of column.
    id: {

        // Sequelize module has INTEGER Data_Type.
        type: Sequelize.INTEGER,

        // To increment user_id automatically.
        autoIncrement: true,

        // user_id can not be null.
        allowNull: false,

        // For uniquely identify user.
        primaryKey: true
    },
    Key: { type: Sequelize.STRING, allowNull: false },
    TransactionID: { type: Sequelize.STRING, allowNull: false },
    ApplicationID: { type: Sequelize.STRING, allowNull: false },
    Birth_ID: { type: Sequelize.STRING, allowNull: false },
    Certificate_ID: { type: Sequelize.STRING, allowNull: false },
    Name: { type: Sequelize.STRING, allowNull: false },
    Gender: { type: Sequelize.STRING, allowNull: false },
    Date_of_Birth: { type: Sequelize.STRING, allowNull: false },
    Place_of_Birth: { type: Sequelize.STRING, allowNull: false },
    Name_of_Mother: { type: Sequelize.STRING, allowNull: false },
    Name_of_Father: { type: Sequelize.STRING, allowNull: false },
    Permanent_address_of_parents: { type: Sequelize.STRING, allowNull: false },
    Municipality: { type: Sequelize.STRING, allowNull: false },
    Registration_Number: { type: Sequelize.STRING, allowNull: false },
    Date_of_Registration: { type: Sequelize.STRING, allowNull: false },
    Date_of_Issue: { type: Sequelize.STRING, allowNull: false },
    UpdateRecordKey: { type: Sequelize.STRING, allowNull: true },
})
sequelize.sync()
// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = SQLQuery
