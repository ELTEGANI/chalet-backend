'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      nationalId: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      geneder: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      accountStatus: {
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
    return queryInterface.dropTable('Users');
  }
};