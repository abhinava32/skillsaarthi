'use strict';
const { Sequelize } = require('sequelize');
const sequelize = require('../../Config/sequelize');

const admins = sequelize.define('admins',{
  admin_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  accesslevel: {
    type: Sequelize.ENUM('X','Y','Z'),
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false
  },
  phone: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  // deletedAt: {
  //   type: Sequelize.DATE
  // }
},{
  // paranoid:true,
  freezeTableName:true,
  modelName:'admins'
});

module.exports = admins;