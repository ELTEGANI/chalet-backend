'use strict';
module.exports = (sequelize, DataTypes) => {
  const sms_codes = sequelize.define('sms_codes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:0      
    }
  }, {});
  sms_codes.associate = function(models) {
    // associations can be defined here
    sms_codes.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
  };
  return sms_codes;
};