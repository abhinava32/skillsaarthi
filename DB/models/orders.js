'use strict';
const { Sequelize } = require('sequelize');

const sequelize = require('../../Config/sequelize');
const orders = sequelize.define('orders', {
  order_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  agency_id: {
    type: Sequelize.INTEGER,
    references:{
      model:'agencies',
      key:'agency_id'
    },
    onUpdate:'CASCADE',
    onDelete:'CASCADE',
    allowNull:false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull:false
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull:false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
},{
  freezeTableName:true,
  modelName:'orders'
});

orders.associate = function(models){
  orders.belongsTo(models.agencies,{
    foreignKey:'agency_id',
    as:'agency'
  });
  orders.hasOne(models.transactions,{
    foreignKey:'order_id',
    as:transaction
  });
  orders.hasOne(models.boughts,{
    foreignKey:'order_id',
    as:bought
  })
};

module.exports = orders;