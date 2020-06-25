'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reservations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      chaletId: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      reservationStartDate: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      reservationEndDate: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      reservationAmount: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      reservationStatus: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      reservationConditions: {
        type:Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reservations');
  }
};