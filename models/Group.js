const { Model, DataTypes } = require('sequelize');
class Group extends Model {}

function initModel(sequelize) {
    Group.init(
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
        },
        {
            sequelize,
            tableName: 'groups',
            timestamps: false,
        }
    );
    return Group;
}

module.exports = { Group, initModel };