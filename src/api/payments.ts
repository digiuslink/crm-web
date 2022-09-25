import Parse, { ObjectConstructor } from "parse";
import { IPagination } from "../pages/BLFs/BLFs";
import { setPaymentsCount } from "../pages/Payments/paymentSlice";

export interface IPayment {
  objectId?: string;
  client: { objectId?: string; fullName: string; assignedTo?: any };
  paymentDate: Date;
  paymentType?: { objectId?: string; name?: string };
  amount?: number;
  gps?: { latitude: number; longitude: number };
  addedBy?: any;
}

export const addPayment = async (payment: IPayment) => {
  // Get Client POINTER
  const clientQuery = new Parse.Query("Client");
  clientQuery.equalTo("objectId", payment.client.objectId);
  const client = (await clientQuery.first())?.toPointer();

  // Get PaimentType pointer
  const pTypeQuery = new Parse.Query("PaymentType");
  pTypeQuery.equalTo("objectId", payment.paymentType?.objectId);
  const pType = await pTypeQuery.first();

  const Payment: ObjectConstructor = Parse.Object.extend("Payment");
  const _payment = new Payment();
  _payment.set("addedBy", Parse.User.current());
  _payment.set("client", client);
  _payment.set("paymentDate", payment.paymentDate);
  _payment.set("paymentType", pType);
  _payment.set("amount", payment.amount);
  _payment.set("gps", payment.gps);
  await _payment.save();
};

export const updatePayment = async (payment: IPayment) => {
  // Get Client pointer
  const clientQuery = new Parse.Query("Client");
  clientQuery.equalTo("objectId", payment.client.objectId);
  const client = (await clientQuery.first())?.toPointer();

  // Get PaimentType pointer
  const pTypeQuery = new Parse.Query("PaymentType");
  pTypeQuery.equalTo("objectId", payment.paymentType.objectId);
  const pType = await pTypeQuery.first();
  const query = new Parse.Query("Payment");
  query.equalTo("objectId", payment.objectId);
  const _payment = await query.first();
  _payment.set("client", client);
  _payment.set("paymentDate", payment.paymentDate);
  _payment.set("paymentType", pType);
  _payment.set("amount", payment.amount);
  await _payment.save();
};

export const getPayment = async (objectId: string) => {
  const query = new Parse.Query("Payment");
  query.equalTo("objectId", objectId);
  query.include("client");
  query.include("client.assignedTo");
  query.include("addedBy");
  query.include("paymentType");

  const result = await query.first();
  const _payment: IPayment = {
    paymentDate: result.get("paymentDate"),
    amount: result.get("amount"),
    gps: result.get("gps"),
    objectId: result.id,
    paymentType: {
      objectId: result.get("paymentType").id,
      name: result.get("paymentType").get("name"),
    },
    addedBy: result.get("addedBy")?.get("username"),
    client: {
      objectId: result.get("client")?.id,
      fullName: result.get("client")?.get("fullName"),
      assignedTo: result.get("client")?.get("assignedTo")?.get("username"),
    },
  };

  return _payment;
};

// TODO: Add Filters

export interface IPaymentsFilter {
  pagination?: IPagination;
  client?: string;
}

export const getPayments = async (filter?: IPaymentsFilter, dispatch?: any) => {
  const query = new Parse.Query("Payment");

  query.include("client");
  query.include("client.assignedTo");

  query.descending("paymentDate");

  if (filter) {
    if (filter.client) {
      const clientQuery = new Parse.Query("Client");
      clientQuery.equalTo("objectId", filter.client);
      const client = await clientQuery.first();
      query.equalTo("client", client);
    }
    if (filter.pagination) {
      const { page, pageSize } = filter.pagination;
      query.skip((page - 1) * pageSize);
      query.limit(pageSize);
      query.withCount(true);
    }
  }

  const result = (await query.find({})) as any;

  const payments: IPayment[] = result?.results?.map((item) => {
    const _assignedTo = item.toJSON().client.assignedTo;
    const _item: IPayment = {
      objectId: item.id,
      client: {
        objectId: item.get("client")?.id,
        fullName: item.get("client")?.get("fullName"),
        assignedTo: _assignedTo.username,
      },
      paymentDate: item.get("paymentDate"),
      amount: item.get("amount"),
      paymentType: {
        objectId: item.get("paymentType")?.id,
        name: item.get("paymentType")?.get("name"),
      },
      gps: item.get("gps"),
    };
    return _item;
  });
  dispatch(setPaymentsCount(result?.count));
  return payments;
};

// Payment Configs CRUD

export interface IPaymentType {
  objectId?: string;
  name: string;
}

export const addPaymentType = async ({ name }: IPaymentType) => {
  const PaymentType: ObjectConstructor = Parse.Object.extend("PaymentType");

  const query = new Parse.Query("PaymentType");
  query.equalTo("name", name);
  const result = await query.first();
  if (result) {
    return;
  }

  const _paymentType = new PaymentType();

  _paymentType.set("name", name);
  await _paymentType.save();
};

export const getPaymentTypes = async () => {
  const query = new Parse.Query("PaymentType");
  const result = await query.find({});
  const _paymentTypes: IPaymentType[] = result.map((item) => ({
    objectId: item.id,
    name: item.get("name"),
  }));

  return _paymentTypes;
};

export const updatePaymentType = async ({ objectId, name }: IPaymentType) => {
  const query = new Parse.Query("PaymentType");
  query.equalTo("objectId", objectId);
  const _paymentType = await query.first();
  _paymentType.set("name", name);
  await _paymentType.save();
};

export const deletePaymentType = async (objectId: string) => {
  // get paymentType Pointer
  const query = new Parse.Query("PaymentType");
  query.equalTo("objectId", objectId);
  const _paymentType = await query.first();
  // Check if this type is used in any payment
  const paymentQuery = new Parse.Query("Payment");
  paymentQuery.equalTo("paymentType", _paymentType);
  const result = await paymentQuery.first();
  if (result !== undefined) {
    throw new Error("vous ne pouvez pas supprimer ce type ");
  } else {
    await _paymentType.destroy();
  }
};
