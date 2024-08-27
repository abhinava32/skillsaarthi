'use strict';
const { Sequelize } = require('sequelize');
const  sequelize  = require('../../Config/sequelize');
const agencies = sequelize.define('agencies', {
  agency_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull:false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      len: [10,10],
      isNumeric: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull:false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false
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

agencies.associate = function(models){
  agencies.hasMany(models.orders,{
    foreignKey:'agency_id',
    as:'order'
  });
  
  agencies.hasMany(models.carts,{
    foreignKey:'agency_id',
    as:'cart'
  });

  agencies.hasMany(models.boughts,{
    foreignKey:'agency_id',
    as:'bought'
  });
  
  
};

module.exports = agencies;