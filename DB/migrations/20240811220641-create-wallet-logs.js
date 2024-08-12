'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallet_logs', {
      wallet_log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transaction_type : {
        type: Sequelize.ENUM('CREDIT','DEBIT'),
        allowNull: false
      },
      wallet_id:{
        type: Sequelize.INTEGER,
        reference:{
          model:'wallets',
          key:'wallet_id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE',
        allowNull: false
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
    await queryInterface.dropTable('wallet_logs');
  }
};