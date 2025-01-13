const sequelize = require("../sequelize");

const { User, initModel: initUser } = require("./User");
const { Group, initModel: initGroup } = require("./Group");
const { Sale, initModel: initSale } = require("./Sale");
const { UserGroup, initModel: initUserGroup } = require("./UserGroup");

initUser(sequelize);
initGroup(sequelize);
initSale(sequelize);
initUserGroup(sequelize);

// User [One-to-Many] Sale
User.hasMany(Sale);
Sale.belongsTo(User, { foreignKey: "user_id" });

// User [Many-to-Many] Group
User.belongsToMany(Group, {
  through: UserGroup,
  foreignKey: "user_id",
  otherKey: "group_id",
});

module.exports = {
  sequelize,
  User,
  Group,
  Sale,
  UserGroup,
};
