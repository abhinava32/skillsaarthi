"use strict";
const { Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const agencies = sequelize.define(
    "agencies",
    {
      agency_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [10, 10],
          isNumeric: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: "agencies",
    }
  );

  agencies.associate = function (models) {
    // One agency can have many orders
    agencies.hasMany(models.orders, {
      foreignKey: "agency_id",
    });

    // One agency can have one cart
    agencies.belongsToMany(models.trainees, {
      through: models.carts,
      foreignKey: "agency_id",
      otherKey: "trainee_id",
      as: "trainees",
    });

    // One agency can have many bought records
    agencies.hasMany(models.boughts, {
      foreignKey: "agency_id",
      as: "purchasedTrainees", // Alias to access purchased trainees
    });
  };
  return agencies;
};
