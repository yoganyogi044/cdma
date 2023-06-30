const bcrypt_nodejs = require("bcrypt");
const Sequelize = require('sequelize')
const sequelize = require("../database/conn");

const birthSchema = sequelize.define('certificates', {

    // Column-1, user_id is an object with 
    // properties like type, keys, 
    // validation of column.
    id: {
  
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
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
  })
  sequelize.sync()

  module.exports = birthSchema