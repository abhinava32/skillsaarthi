'use strict';
const { Model, Sequelize } = require('sequelize');
const  sequelize  = require('../../Config/sequalize');
module.exports = sequelize.define('agencies', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  gstin: {
    type: Sequelize.INTEGER
  },
  email: {
    type: Sequelize.STRING
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt: {
    type: Sequelize.DATE
  }
},{
  paranoid:true,
  freezeTableName: true,
  modelName: 'agencies'
});