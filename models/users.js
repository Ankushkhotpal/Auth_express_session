'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    full_name: {
      type: DataTypes.STRING(150),
      // defaultValue: DataTypes.UUIDV4,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_otp:{
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    otp_verify_status: {
      type: DataTypes.ENUM('VERIFIED', 'UNVERIFIED', 'PENDING'),
      defaultValue: 'PENDING'
    },
    session_status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'INACTIVE'
    }
  }, {
     id: {
         primaryKey: false,
         autoIncrement: false,
         type: DataTypes.INTEGER,
       },
       freezeTableName: true,
      //  deletedAt: 'destroyTime',
       paranoid: true
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};