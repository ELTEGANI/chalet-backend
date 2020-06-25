'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
      },
    firstName:{ 
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    geneder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountStatus: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Users.associate = function(models) {
    Users.hasMany(models.Chalets, { foreignKey: 'chaletId', targetKey: 'id' });
    Users.hasMany(models.Reservations, { foreignKey: 'userId', targetKey: 'id' });
    Users.hasMany(models.Inbox, { foreignKey: 'userId', targetKey: 'id' });

  };
  return Users;
};