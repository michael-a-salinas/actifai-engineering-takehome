const { Model, DataTypes } = require('sequelize');
class Sale extends Model {}

function initModel(sequelize) {
    Sale.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'user_id',
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'sales',
            timestamps: false,
        }
    );
    return Sale;
}

module.exports = { Sale, initModel };
