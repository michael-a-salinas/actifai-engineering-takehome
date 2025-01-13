const { Model, DataTypes } = require('sequelize');
class User extends Model {}

function initModel(sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'users',
            timestamps: false,
        }
    );
    return User;
}

module.exports = { User, initModel };