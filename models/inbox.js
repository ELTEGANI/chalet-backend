'use strict';
module.exports = (sequelize, DataTypes) => {
  const Inbox = sequelize.define('Inbox', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    userId:{
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletId:{
      type: DataTypes.STRING,
      allowNull: false
    },
    userMessage:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Inbox.associate = function(models) {
    // associations can be defined here
    Inbox.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
    Inbox.belongsTo(models.Chalets, { foreignKey: 'chaletId', targetKey: 'id' });

  };
  return Inbox;
};