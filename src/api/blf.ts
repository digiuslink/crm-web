import moment from "moment";
import Parse, { ObjectConstructor } from "parse";
import { IBlf, setBlfCount } from "../pages/BLFs/blfSlice";

// Client
export const addBlf = async (_blf: IBlf) => {
  const Blf: ObjectConstructor = Parse.Object.extend("Blf");
  const Client: ObjectConstructor = Parse.Object.extend("Client");
  const clientQuery = new Parse.Query(Client);

  clientQuery.equalTo("objectId", _blf?.client.objectId);
  const client = await clientQuery.first();
  if (!client) throw new Error("Client doesn't exist");
  _blf.client = client?.toPointer();

  const blf = new Blf();
  const currentUser = Parse.User.current();
  blf.set("addedBy", currentUser);

  await blf.save({ ..._blf });
};

export const editBlf = async (blf: IBlf) => {
  const query = new Parse.Query("Blf");
  query.equalTo("objectId", blf.objectId);
  const _blf = await query.first();

  // Get client pointer
  const clientQuery = new Parse.Query("Client");
  clientQuery.equalTo("objectId", blf?.client.objectId);
  const client = await clientQuery.first();

  _blf.set("client", client.toPointer());
  delete blf.client;
  return await _blf.save({ ...blf });
};

export const getBlf = async (blfObjectId: string) => {
  const Blf: ObjectConstructor = Parse.Object.extend("Blf");
  const query = new Parse.Query(Blf);
  query.equalTo("objectId", blfObjectId);
  query.include("client");
  query.include("addedBy");

  const result = await query.first();
  return result.toJSON();
};

export const getBlfs = async (filter?: IBlfFilter, dispatch?: any) => {
  const Blf: ObjectConstructor = Parse.Object.extend("Blf");
  const query = new Parse.Query(Blf);
  if (filter) {
    if (filter.client) {
      const clientQuery = new Parse.Query("Client");
      clientQuery.equalTo("objectId", filter.client);
      const client = await clientQuery.first();
      query.equalTo("client", client);
    }
    if (filter.pagination) {
      query.limit(filter.pagination.pageSize);
      query.skip(filter.pagination.pageSize * (filter.pagination.page - 1));
    }
    if (filter.blfDate) {
      const hrs = new Date().getHours();
      const date = moment(filter.blfDate).subtract(hrs, "hour").toDate();
      query.greaterThan("blfDate", date);
      query.lessThan("blfDate", filter.blfDate);
    }
    if (filter.assignedTo) {
      // Get clients assigned to user
      const clientQuery = new Parse.Query("Client");
      clientQuery.equalTo("assignedTo", filter.assignedTo);

      const clients = await clientQuery.find();
      // Get clients Blfs
      query.containedIn("client", clients);
    }
  }
  query.withCount(true);
  query.descending("blfDate");
  query.include("client");
  query.include("addedBy");
  const result = (await query.find()) as any;
  dispatch(setBlfCount(result.count));
  const blfs = result.results.map((blf: any) => blf.toJSON());
  return blfs;
};

// export const getBlfsCount = async () => {
//   const count = await Parse.Cloud.run("countBlfs");
//   return count;
// };

export interface IBlfFilter {
  pagination?: { page: number; pageSize?: number };
  client?: string;
  blfDate?: Date;
  assignedTo?: any;
}
