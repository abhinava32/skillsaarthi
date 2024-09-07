'use strict';
const { Sequelize } = require('sequelize');
const sequelize = require('../../Config/sequelize');

const boughts = sequelize.define('boughts',{
  bought_id: {
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
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  trainee_id: {
    type: Sequelize.INTEGER,
    references:{
      model:'trainees',
      key:'trainee_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  order_id: {
    type: Sequelize.INTEGER,
    references:{
      model:'orders',
      key:'order_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
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
  modelName:'boughts'
})

boughts.associate = (models) => {
  boughts.belongsTo(models.trainees,{
    foreignKey:'trainee_id',
    as:'trainee'
  });
  boughts.belongsTo(models.agencies,{
    foreignKey:'agency_id',
    as:'agency'
  });
  boughts.belongsTo(models.orders,{
    foreignKey:'order_id',
    as:'order'
  });
}

module.exports = boughts;