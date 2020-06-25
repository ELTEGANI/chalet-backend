'use strict';
module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define('Images', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    chaletId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Images.associate = function(models) {
    // associations can be defined here
    Images.belongsTo(models.Chalets, { foreignKey: 'chaletId', targetKey: 'id' });
  };
  return Images;
};