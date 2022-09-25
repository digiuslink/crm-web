import Parse from "parse";

export const getCurrentUserId = () => {
  return Parse.User.current()?.id;
};

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  try {
    const user = await Parse.User.logIn(username, password);
    // const { role } = user.getACL().toJSON();
    if (user.get("appRole") !== "admin") throw new Error("Not authorized");
    return user.id;
  } catch (err) {
    throw Error(err.message);
  }
};
export const logout = async (): Promise<void> => {
  try {
    await Parse.User.logOut();
  } catch (err) {
    throw Error(err.message);
  }
};
