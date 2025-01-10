const overwriteFields = (fieldsMap, data) => {
  Object.keys(fieldsMap).forEach((field) => {
    data[fieldsMap[field]] = data[field];
    delete data[field];
  });
  return data;
};

const mapUserData = (data) =>
  overwriteFields(
    {
      "User.id": "userId",
      "User.name": "userName",
      "User.role": "userRole",
    },
    data
  );

const mapGroupData = (data) =>
  overwriteFields(
    {
      "User.Groups.id": "groupId",
      "User.Groups.name": "groupName",
    },
    data
  );

module.exports = { mapUserData, mapGroupData };
