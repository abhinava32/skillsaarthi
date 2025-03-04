"use strict";
const { Sequelize } = require("sequelize");

const sequelize = require("../../Config/sequelize");
const wallet_logs = require("./wallet_logs");

module.exports = (sequelize) => {
  const wallets = sequelize.define(
    "wallets",
    {
      wallet_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      agent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "agents",
          key: "agent_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      balance: {
        type: Sequelize.INTEGER,
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
      modelName: "wallets",
    }
  );

  wallets.associate = (models) => {
    wallets.belongsTo(models.agents, {
      foreignKey: "agent_id",
      as: "agent",
    });

    wallets.hasOne(models.wallet_logs, {
      foreignKey: "wallet_id",
      as: "logs",
    });
  };
  return wallets;
};
