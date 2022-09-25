import Parse, { ObjectConstructor } from "parse";
import { IClient } from "./../pages/Clients/IClient";

export const addClient = async (client: IClient) => {
  const Client: ObjectConstructor = Parse.Object.extend("Client");
  const _client = new Client();
  _client.set("addedBy", Parse.User.current());
  await _client.save({ ...client });
};

export const editClient = async (client: IClient) => {
  const query = new Parse.Query("Client");
  query.equalTo("objectId", client.objectId);
  const _client = await query.first();
  return await _client.save({ ...client });
};

export const getClient = async (objectId: string) => {
  const Client: ObjectConstructor = Parse.Object.extend("Client");
  const query = new Parse.Query(Client);
  query.include("assignedTo");
  const client = (await query.get(objectId)).toJSON();
  return client as IClient;
};

export const setClientVerified = async (
  objectId: string,
  isVerified: boolean
) => {
  const query = new Parse.Query("Client");
  query.equalTo("objectId", objectId);
  const client = await query.first();
  client.set("isVerified", isVerified);
  client.save();
  return isVerified;
};

export const getClients = async (filter?: IClientFilter) => {
  let clients: IClient[] = [];
  const Client = Parse.Object.extend("Client");
  const query = new Parse.Query(Client);
  const userQuery = new Parse.Query(Parse.User);

  if (filter) {
    filter.category && query.equalTo("category", filter.category);

    if (filter.addedBy) {
      userQuery.equalTo("objectId", filter.addedBy);
      query.equalTo("addedBy", await userQuery.first());
    }

    filter.isVerified !== undefined &&
      query.equalTo("isVerified", filter.isVerified);

    filter.wilaya && query.equalTo("wilaya", filter.wilaya);

    filter.clientState && query.equalTo("clientState", filter.clientState);

    if (filter.assignedTo) {
      userQuery.equalTo("objectId", filter.assignedTo);
      query.equalTo("assignedTo", await userQuery.first());
    }
  }
  query.ascending("fullName");
  query.include("assignedTo");
  const result = await query.find();
  clients = result.map((client) => client.toJSON() as IClient);

  return clients;
};

export const getClientFinance = async (clientId: string) => {
  return await Parse.Cloud.run("getFinance", { clientId });
};

export interface IClientFilter {
  category?: string;
  wilaya?: string;
  addedBy?: string;
  isVerified?: boolean;
  clientState?: string;
  assignedTo?: string;
}
