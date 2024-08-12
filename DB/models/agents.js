'use strict';
const {  Model, Sequelize } = require('sequelize');
const sequalize = require('../../Config/sequalize');

module.exports = sequalize.define('agents',{
  agent_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.CHAR(10),
    allowNull:false
  },
  email: {
    type: Sequelize.STRING,
    allowNull:false
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false
  },
  state: {
    type: Sequelize.ENUM('ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 
      'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL PRADESH', 'JHARKHAND', 
      'KARNATAKA', 'KERALA', 'MADHYA PRADESH', 'MAHARASHTRA', 
      'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA', 
      'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 
      'TRIPURA', 'UTTAR PRADESH', 'UTTARAKHAND', 'WEST BENGAL',
      'ANDAMAN AND NICOBAR ISLANDS', 'CHANDIGARH', 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 
      'DELHI', 'JAMMU AND KASHMIR', 'LADAKH', 'LAKSHADWEEP', 'PUDUCHERRY'),
      allowNull:false
  },
  district: {
    type: Sequelize.STRING,
    allowNull:false
  },
  block: {
    type: Sequelize.STRING,
    allowNull:false
  },
  pincode: {
    type: Sequelize.CHAR(6),
    allowNull:false
  },
  age: {
    type: Sequelize.SMALLINT,
    allowNull:false,
    validate:{
      min: 15,
      max: 99
    }
  },
  profession: {
    type: Sequelize.ENUM (
      'Doctor',
      'Teacher',
      'Cyber Cafe Operator',
      'Social Worker',
      'Businessperson',
      'Politician',
      'Farmer',
      'Labourer',
      'Nurse',
      'Engineer',
      'Accountant',
      'Shopkeeper',
      'Police Officer',
      'Electrician',
      'Plumber',
      'Other'
    ),
    allowNull:true
  },
  photo: {
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
  }
},{
  paranoid:true,
  freezeTableName:true,
  modelName:'agents'
});

agents.associate = function(models){
  agents.hasMany(models.trainees, {
    foreignKey:'agent_id',
    as:'agent_id'
  });

  agents.hasOne(models.wallets,{
    foreignKey:'agent_id',
    as:'wallet'
  });
}