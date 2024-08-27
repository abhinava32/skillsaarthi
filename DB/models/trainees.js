'use strict';
const { Sequelize } = require('sequelize');
const sequelize = require('../../Config/sequelize');

const trainees = sequelize.define('trainees',{
  trainee_id: {
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
  domicile: {
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
  physically_challenged : {
    type: Sequelize.ENUM('Y','N'),
    allowNull:false
  },
  gender: {
    type: Sequelize.ENUM('M','F'),
    allowNull:false
  }
  ,
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
  education: {
    type: Sequelize.ENUM('SCHOOL','METRICULATION','INTERMEDIATE','GRADUATE','POST-GRADUATE','PHD'),
    allowNull: false
  },
  agent_id: {
    type: Sequelize.INTEGER,
    references:{
      model:'agents',
      key:'agent_id'
    },
    onUpdate:'CASCADE',
    onDelete:'SET NULL',
    allowNull:true
  },
  religion:{
    type:Sequelize.ENUM (
      'Hinduism',
      'Islam',
      'Christianity',
      'Sikhism',
      'Buddhism',
      'Jainism',
      'Zoroastrianism',
      'Judaism',
      'Other'
    ),
    allowNull:false
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isEnrolled:{
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
  modelName:'trainees'
});

trainees.associate = function(models){
  trainees.belongsTo(models.agents,{
    foreignKey:'agent_id',
    as:'agent',
    allowNull:true
  });
    // One-to-one relationship with Bought
  trainees.hasMany(models.carts, {
    foreignKey: 'trainee_id',
    as: 'cart',
    allowNull: true // Allow `trainee_id` to be null in Bought table
  });

  trainees.hasOne(models.boughts, {
    foreignKey: 'trainee_id',
    as: 'boughts',
    allowNull: true // Allow `trainee_id` to be null in Bought table
  });
  
};

module.exports = trainees;