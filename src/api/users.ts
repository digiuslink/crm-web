import Parse from "parse";

export const getUsers = async () => {
  const query = new Parse.Query(Parse.User);
  const users = await query.findAll();
  // .map((user) => user.toJSON());
  return users;
};
