import Parse, { ObjectConstructor } from "parse";

export interface INotification {
  for: string;
  objectId: string;
}

export const getNotifs = async (from?: string) => {
  const Notification: ObjectConstructor = Parse.Object.extend("Notification");
  const query = new Parse.Query(Notification);
  query.equalTo("visited", false);
  query.includeAll();
  const result = await query.find();

  return result.map((rs) => {
    const notif: INotification = {
      for: rs.toJSON().for,
      objectId: rs.toJSON().object.objectId,
    };
    return notif;
  });
};

export const deleteNotif = async (notif: INotification) => {
  const Notification: ObjectConstructor = Parse.Object.extend("Notification");

  const query = new Parse.Query(Notification);

  query.equalTo("object.objectId", notif.objectId);

  const result = await query.first();
  await result.destroy();
};
