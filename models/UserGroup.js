const { Model, DataTypes } = require('sequelize');
class UserGroup extends Model {}

function initModel(sequelize) {
    UserGroup.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'user_id',
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'groups',
                    key: 'id',
                },
                field: 'group_id',
            },
        },
        {
            sequelize,
            tableName: 'user_groups',
            timestamps: false,
        }
    );
    return UserGroup;
}

module.exports = { UserGroup, initModel };