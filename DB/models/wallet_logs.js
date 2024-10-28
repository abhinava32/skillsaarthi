"use strict";
const { Model, Sequelize } = require("sequelize");

const sequelize = require("../../Config/sequelize");

module.exports = (sequelize) => {
  const wallet_logs = sequelize.define(
    "wallet_logs",
    {
      wallet_log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transaction_type: {
        type: Sequelize.ENUM("CREDIT", "DEBIT"),
        allowNull: false,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: "wallets",
          key: "wallet_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      freezeTableName: true,
      modelName: "wallet_logs",
    }
  );

  wallet_logs.associate = (models) => {
    wallet_logs.belongsTo(models.wallets, {
      foreignKey: "wallet_id",
      as: "wallet",
    });
  };
  return wallet_logs;
};
