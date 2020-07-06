'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chalets = sequelize.define('Chalets', {
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
    chaletName: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletLongtitude: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletLatitude: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletServices: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    ChaletDescriptions: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletType: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletPriceNormalDay: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletPriceHoliday: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletInsurance: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletPercentage: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletCapacity: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletCommison: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletStatus: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    chaletApproval: { 
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Chalets.associate = function(models) {
    // associations can be defined here
    Chalets.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
    Chalets.hasMany(models.Images, { foreignKey: 'chaletId', targetKey: 'id' });
    Chalets.hasMany(models.Reservations, { foreignKey: 'chaletId', targetKey: 'id' });
    Chalets.hasMany(models.Inbox, { foreignKey: 'chaletId', targetKey: 'id' });

  };
  return Chalets;
};