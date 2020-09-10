'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Chalets', {
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
      chaletName: {
         type:Sequelize.STRING,
         allowNull: false,
      },
      chaletLongtitude: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletLatitude: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletServices: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      ChaletDescriptions: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletType: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletPriceNormalDay: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletPriceHoliday: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletInsurance: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletPercentage: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletCapacity: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletCommison: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletStatus: {
         type:Sequelize.STRING,
        allowNull: false,
      },
      chaletApproval: {
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
      },
      bankAccount: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bankName: {
        allowNull: false,
        type: Sequelize.DATE
      },
     bankUserName: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chalets');
  }
};
