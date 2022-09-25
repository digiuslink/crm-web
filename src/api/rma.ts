import Parse, { ObjectConstructor } from "parse";
import { IPagination } from "../pages/BLFs/BLFs";
import { IRMA } from "../pages/RMA/RMAs";
import { ISettingsParm } from "./routes";

export const addRMA = async (rma: IRMA) => {
  // get User Pointer
  const currentUser = Parse.User.current();

  // Via Pointer
  const viaQuery = new Parse.Query("via");
  viaQuery.equalTo("objectId", rma.via?.objectId);
  const viaPointer = await viaQuery.first();

  // Client pointer
  const clientQuery = new Parse.Query("Client");
  clientQuery.equalTo("objectId", rma.client?.objectId);
  const clientPointer = await clientQuery.first();

  // Products. reason pointer
  const products = await Promise.all(
    rma.products?.map(async (pr) => {
      const rmaReasonQuery = new Parse.Query("rmaReason");
      rmaReasonQuery.equalTo("objectId", pr.rmaReason?.objectId);
      const rmaReasonPointer = await rmaReasonQuery.first();
      return {
        designation: pr.designation,
        qte: pr.qte,
        rmaReason: rmaReasonPointer,
      };
    })
  );
  // * Parse Object
  const RMA: ObjectConstructor = Parse.Object.extend("rma");
  const _rma = new RMA();

  _rma?.set("addedBy", currentUser);
  _rma?.set("client", clientPointer);
  _rma?.set("rmaDate", rma.rmaDate);
  _rma?.set("via", viaPointer);
  _rma?.set("products", products);

  await _rma?.save();
};

// ! Update RMA
export const editRMA = async (rma: IRMA) => {
  // get User Pointer
  const currentUser = Parse.User.current();

  // Via Pointer
  const viaQuery = new Parse.Query("via");
  viaQuery.equalTo("objectId", rma.via?.objectId);
  const viaPointer = await viaQuery.first();

  // Client pointer
  const clientQuery = new Parse.Query("Client");
  clientQuery.equalTo("objectId", rma.client?.objectId);
  const clientPointer = await clientQuery.first();

  // Products. reason pointer
  const products = await Promise.all(
    rma.products?.map(async (pr) => {
      const rmaReasonQuery = new Parse.Query("rmaReason");
      rmaReasonQuery.equalTo("objectId", pr.rmaReason?.objectId);
      const rmaReasonPointer = await rmaReasonQuery.first();
      return {
        designation: pr.designation,
        qte: pr.qte,
        rmaReason: rmaReasonPointer,
      };
    })
  );
  // * Parse Object
  const rmaQuery = new Parse.Query("rma");
  rmaQuery.equalTo("objectId", rma.objectId);
  const _rma = await rmaQuery.first();

  _rma.set("addedBy", currentUser);
  _rma.set("client", clientPointer);
  _rma.set("rmaDate", rma.rmaDate);
  _rma.set("via", viaPointer);
  _rma.set("products", products);

  await _rma.save();
};

// ! GET RMAs
export interface IRAMFilter {
  pagination?: IPagination;
}
export const getRMAs = async (filter?: IRAMFilter) => {
  const rmaQuery = new Parse.Query("rma");
  rmaQuery.addDescending("rmaDate");
  rmaQuery.include("client");
  rmaQuery.include("rmaReason");
  rmaQuery.include("via");

  const result = await rmaQuery.find();

  const rmas: IRMA[] = result.map((rm) => {
    const _rma: IRMA = {
      objectId: rm.id,
      client: {
        fullName: rm.get("client")?.get("fullName"),
        assignedTo: {
          username: rm.get("client")?.get("assignedTo")?.get("username"),
        },
      },
      via: {
        objectId: rm.get("via")?.id,
        name: rm.get("via")?.get("name"),
      },
      rmaDate: rm.get("rmaDate"),
      products: rm.get("products")?.map((pr: any) => {
        return {
          designation: pr.designation,
          qte: pr.qte,
          rmaReason: {
            objectId: pr.rmaReason?.id,
            name: pr.rmaReason?.get("name"),
          },
        };
      }),
    };
    return _rma;
  });
  return rmas;
};

// ! GET RMA
export const getRMA = async (objectId: string) => {
  const rmaQuery = new Parse.Query("rma");
  rmaQuery.include("client");
  rmaQuery.include("client.assignedTo");
  rmaQuery.include("products.rmaReason");
  rmaQuery.include("via");

  rmaQuery.equalTo("objectId", objectId);
  const result = await rmaQuery.first();

  const rma: IRMA = {
    objectId: result?.id,
    client: {
      objectId: result?.get("client")?.id,
      fullName: result?.get("client").get("fullName"),
      assignedTo: result?.get("client").get("assignedTo").get("username"),
    },
    addedBy: { username: result?.get("addedBy").get("username") },
    via: {
      objectId: result?.get("via").id,
      name: result?.get("via")?.get("name"),
    },
    rmaDate: result?.get("rmaDate"),
    gps: result?.get("gps"),
    products: result?.get("products")?.map((pr: any) => {
      return {
        designation: pr.designation,
        qte: pr.qte,
        rmaReason: {
          objectId: pr.rmaReason?.id,
          name: pr.rmaReason?.get("name"),
        },
      };
    }),
  };
  return rma;
};

// * ============================================= * //
// * Configs CRUD
// * ============================================= * //

export const addSettingsParam = async (
  param: string,
  { name }: ISettingsParm
) => {
  const ParameterObj: ObjectConstructor = Parse.Object.extend(param);

  const query = new Parse.Query(param);
  query.equalTo("name", name);
  const result = await query.first();
  if (result) {
    return;
  }

  const _paramObj = new ParameterObj();

  _paramObj.set("name", name);
  await _paramObj.save();
};

export const getSettingsParams = async (param: string) => {
  const query = new Parse.Query(param);
  const result = await query.find({});
  const _params: ISettingsParm[] = result.map((item) => ({
    objectId: item.id,
    name: item.get("name"),
  }));

  return _params;
};

export const updateSettingParam = async (
  param: string,
  { objectId, name }: ISettingsParm
) => {
  const query = new Parse.Query(param);
  query.equalTo("objectId", objectId);
  const _param = await query.first();
  _param?.set("name", name);
  await _param?.save();
};

export const deleteSettingParam = async (param: string, objectId: string) => {
  // get paymentType Pointer
  const query = new Parse.Query(param);
  query.equalTo("objectId", objectId);
  const _param = await query.first();
  // Check if this type is used in any payment
  const paramQuery = new Parse.Query("Payment");
  paramQuery.equalTo("paymentType", _param);
  const result = await paramQuery.first();
  if (result !== undefined) {
    throw new Error("vous ne pouvez pas supprimer ce type ");
  } else {
    await _param.destroy();
  }
};
