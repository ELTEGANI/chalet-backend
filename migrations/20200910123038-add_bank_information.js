'use strict';


module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Chalets', // table name
        'bankAccount', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'Chalets',
        'bankName',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'Chalets',
        'bankUserName',
        {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Chalets', 'bankAccount'),
      queryInterface.removeColumn('Chalets', 'bankName'),
      queryInterface.removeColumn('Chalets', 'bankUserName'),
    ]);
  },
};
