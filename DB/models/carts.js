'use strict';
const { Sequelize } = require('sequelize');
const sequelize = require('../../Config/sequelize');

const carts = sequelize.define({
  cart_id: {
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
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
},{
  freezeTableName: true,
  modelName: 'carts'
})

carts.associate = (models) => {
  carts.belongsTo(models.trainees,{
    foreignKey:'trainee_id',
    as:'trainee'
  });
  carts.belongsTo(models.agencies,{
    foreignKey:'agency_id',
    as:'agency'
  });
}

module.exports = carts;