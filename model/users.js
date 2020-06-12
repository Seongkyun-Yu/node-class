module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(100),
      defaultValue: '유성균',
      allowNull: true,
    },
    user_phone: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      allowNull: true,
    },
  });
};
