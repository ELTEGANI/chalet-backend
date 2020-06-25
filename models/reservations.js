'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reservations = sequelize.define('Reservations', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
       type: DataTypes.STRING,
      allowNull: false
    },
    chaletId: {
       type: DataTypes.STRING,
      allowNull: false
    },
    reservationStartDate: {
       type: DataTypes.STRING,
      allowNull: false
    },
    reservationEndDate: {
      type: DataTypes.STRING,
     allowNull: false
   },
    reservationAmount: {
       type: DataTypes.STRING,
      allowNull: false
    },
    reservationStatus: {
       type: DataTypes.STRING,
      allowNull: false
    },
    reservationConditions: {
       type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Reservations.associate = function(models) {
    // associations can be defined here
    Reservations.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
    Reservations.belongsTo(models.Chalets, { foreignKey: 'chaletId', targetKey: 'id' });
  };
  return Reservations;
};