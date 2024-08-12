'use strict';
const {Sequelize} = require('sequelize');
const sequalize = require('../../Config/sequalize');

module.exports = sequalize.define('transactions',{
  transaction_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  order_id: {
    type: Sequelize.INTEGER,
    references:{
      model:'orders',
      key:'order_id'
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
  modelName:'transactions'
})

transactions.associate = function(models){
  transactions.belongsTo('orders',{
    foreignKey:'order_id',
    as:'order',
    allowNull:true
  })
}