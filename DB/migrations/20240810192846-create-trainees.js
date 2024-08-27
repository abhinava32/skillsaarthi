'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainees', {
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
        allowNull:false,
        defaultValue:'password'
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
        type: Sequelize.ENUM('M','F','OTHERS'),
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
        type: Sequelize.STRING,
        allowNull:false,
        validate: {
          isNumeric: true,
          len: [6,6]
        }
      },
      age: {
        type: Sequelize.SMALLINT,
        allowNull:false,
        validate:{
          min: 15,
          max: 80
        }
      },
      education: {
        type: Sequelize.ENUM('SCHOOL','METRICULATION','INTERMEDIATE','GRADUATE','POST-GRADUATE','PHD'),
        allowNull: false
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
        defaultValue: '0'
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainees');
  }
};