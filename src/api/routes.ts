import moment from "moment";
import Parse, { ObjectConstructor } from "parse";

export interface IRoute {
  objectId?: string;
  routeState?: IRouteState;
  scheduledDate: Date;
  locality: string[]; // wilaya list
  addedBy?: {
    objectId: string;
    username: string;
  };
  assignedTo: {
    objectId: string;
    username?: string;
  };
  visits?: IVisit[];
  gps?: {
    latitude: number;
    longitude: number;
  };
  routeFactory?: IRouteFactory;
}

export interface IRouteState {
  objectId?: string;
  name?: string;
}

export interface IVisit {
  objectId?: string;
  client: {
    objectId: string;
    fullName?: string;
  };
  gps?: {
    latitude: number;
    longitude: number;
  };
  type: IVisitType;
  note?: string;
  isVisited?: boolean;
  clientState?: IClientState;
}

export interface IVisitType {
  objectId?: string;
  name?: string;
}

export interface IClientState {
  objectId?: string;
  name?: string;
}
export interface ISettingsParm {
  name?: string;
  objectId?: string;
}

export enum RouteModelNames {
  routeState = "routeState",
  visitType = "visitType",
  clientState = "clientState",
}

export interface IRouteFactory {
  objectId?: string;
  name?: string;
  locality?: string[];
  visits?: [
    {
      clientId: string;
      visitTypeId: string;
    }
  ];
}

// Fuctions

export const createRouteFactory = async ({
  name,
  locality,
  visits,
}: IRouteFactory) => {
  const RouteFactory: ObjectConstructor = Parse.Object.extend("RouteFactory");
  const _routeFactory = new RouteFactory();
  _routeFactory.set("name", name);
  _routeFactory.set("locality", locality);
  _routeFactory.set("visits", visits);

  await _routeFactory.save();
};

export const updateRouteFactory = async ({
  name,
  locality,
  visits,
  objectId,
}: IRouteFactory) => {
  const _routeQuery = new Parse.Query("RouteFactory");
  _routeQuery.equalTo("objectId", objectId);
  const _routeFactory = await _routeQuery.first();
  _routeFactory.set("name", name);
  _routeFactory.set("locality", locality);
  _routeFactory.set("visits", visits);
  await _routeFactory.save();
};
export const deleteRouteFactory = async (routeFactoryId: string) => {
  const query = new Parse.Query("RouteFactory");
  query.equalTo("objectId", routeFactoryId);
  const _routeFactory = await query.first();
  await _routeFactory.destroy();
};

export const getRouteFactories = async () => {
  const query = new Parse.Query("RouteFactory");
  const result = await query.findAll();
  const routeFactory: IRouteFactory[] = result.map((item) => {
    const _item: IRouteFactory = {
      objectId: item.id,
      name: item.get("name"),
      visits: item.get("visits"),
      locality: item.get("locality"),
    };
    return _item;
  });
  return routeFactory;
};

// !Add Route
export const addRoute = async (route: IRoute) => {
  const Route: ObjectConstructor = Parse.Object.extend("Route");
  const _route = new Route();

  // Get assignedTo user pointer
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", route.assignedTo.objectId);

  // get routeFactory pointer
  const routeFactoryQuery = new Parse.Query("RouteFactory");
  routeFactoryQuery.equalTo("objectId", route?.routeFactory?.objectId);

  // Create visits and get their pointers
  const Visit: ObjectConstructor = Parse.Object.extend("Visit");
  let visits = [];

  await Promise.all(
    route.visits?.map(async (_visit) => {
      // get client pointer
      const clientQuery = new Parse.Query("Client");
      clientQuery.equalTo("objectId", _visit.client.objectId);
      // get visit type pointer
      const visitTypeQuery = new Parse.Query("visitType");
      visitTypeQuery.equalTo("objectId", _visit.type.objectId);

      const visit = new Visit();
      visit.set("client", await clientQuery.first());
      visit.set("type", await visitTypeQuery.first());

      visits.push(await visit.save());
    })
  );

  _route.set("addedBy", Parse.User.current());
  _route.set("assignedTo", await userQuery.first());
  _route.set("routeFactory", await routeFactoryQuery.first());

  _route.set("locality", route.locality);
  _route.set(
    "routeState",
    await getConfigPointer(
      RouteModelNames.routeState,
      route.routeState?.objectId
    )
  );
  _route.set("scheduledDate", route.scheduledDate);

  // add visits to route
  const relation = _route.relation("visits");

  relation.add([...visits]);
  await _route.save();
};

// !Update Route
export const updateRoute = async (route: IRoute) => {
  const routeQuery = new Parse.Query("Route");
  routeQuery.equalTo("objectId", route.objectId);
  const _route = await routeQuery.first();

  // Get assignedTo user pointer
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", route.assignedTo.objectId);

  // get visits
  const Visit: ObjectConstructor = Parse.Object.extend("Visit");
  // const relationQuery = _route.relation("visits").query();
  // const oldVisits = await relationQuery.find();

  // update old; delete missing ones; create new ones
  let visits = [];
  await Promise.all(
    route.visits?.map(async (_visit) => {
      // !Create New Visit
      if (_visit.objectId === undefined) {
        // Get client pointer
        const clientQuery = new Parse.Query("Client");
        clientQuery.equalTo("objectId", _visit.client.objectId);

        const visit = new Visit();
        visit.set("client", await clientQuery.first());
        visit.set(
          "type",
          await getConfigPointer(
            RouteModelNames.visitType,
            _visit.type?.objectId
          )
        );
        visit.set(
          "clientState",
          await getConfigPointer(
            RouteModelNames.clientState,
            _visit.clientState?.objectId
          )
        );
        visit.set("gps", _visit.gps);
        visit.set("isVisited", _visit.isVisited);
        visits.push(await visit.save());
      }
      // !Update Existing Visit
      if (_visit.objectId) {
        const visitQuery = new Parse.Query("Visit");
        visitQuery.equalTo("objectId", _visit.objectId);
        const visitToEdit = await visitQuery.first();
        // Get Client pointer
        const clientQuery = new Parse.Query("Client");
        clientQuery.equalTo("objectId", _visit.client.objectId);

        visitToEdit?.set(
          "type",
          await getConfigPointer(
            RouteModelNames.visitType,
            _visit.type?.objectId
          )
        );
        visitToEdit?.set("client", await clientQuery.first());
        visitToEdit?.set(
          "clientState",
          await getConfigPointer(
            RouteModelNames.clientState,
            _visit.clientState?.objectId
          )
        );
        visitToEdit?.set("gps", _visit.gps);
        visitToEdit?.set("isVisited", _visit.isVisited);
        await visitToEdit?.save();
      }
    })
  );

  _route.set("addedBy", Parse.User.current());
  _route.set("assignedTo", await userQuery.first());
  _route.set("locality", route.locality);
  _route.set(
    "routeState",
    await getConfigPointer(
      RouteModelNames.routeState,
      route.routeState?.objectId
    )
  );
  _route.set("scheduledDate", route.scheduledDate);

  // add visits to route
  const relation = _route.relation("visits");

  relation.add([...visits]);
  await _route.save();
};

export interface IGetRoutesFilter {
  startDate?: Date;
  endDate?: Date;
  assignedToID?: string; // TODO
  locality?: string[]; // TODO
  routeStateID?: string; //TODO
}
export const getRoutes = async (filter?: IGetRoutesFilter) => {
  const query = new Parse.Query("Route");
  query.include("assignedTo");
  query.include("addedBy");
  query.include("routeState");

  if (filter) {
    if (filter.assignedToID) {
      const userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("objectId", filter.assignedToID);
      const user = await userQuery.first();
      query.equalTo("assignedTo", user);
    }

    if (filter.startDate && filter.endDate) {
      const hrs = new Date().getHours();
      const addHrs = 24 - filter.endDate?.getHours();
      const startDate = moment(filter.startDate).subtract(hrs, "hour").toDate();
      const endDate = moment(filter.endDate).add(addHrs, "hour").toDate();
      query.greaterThan("scheduledDate", startDate);
      query.lessThan("scheduledDate", endDate);
    }
  }

  const result = await query.find();
  const routes: IRoute[] = result.map((route) => ({
    assignedTo: {
      objectId: route.get("assignedTo")?.id,
      username: route.get("assignedTo")?.get("username"),
    },
    scheduledDate: route.get("scheduledDate"),
    objectId: route.id,
    addedBy: {
      objectId: route.get("addedBy")?.id,
      username: route.get("addedBy")?.get("username"),
    },
    locality: route.get("locality"),
    routeState: {
      objectId: route.get("routeState")?.id,
      name: route.get("routeState")?.get("name"),
    },
  }));
  return routes;
};

export const getRouteDetail = async (routeId: string): Promise<IRoute> => {
  const query = new Parse.Query("Route");
  query.equalTo("objectId", routeId);

  query.include("assignedTo");
  query.include("addedBy");
  query.include("routeState");
  query.include("routeFactory");

  const route = await query.first();
  const visitsQuery = route.relation("visits").query();
  visitsQuery.include("client");
  visitsQuery.include("clientState");
  visitsQuery.include("type");
  const visits = await visitsQuery.find();
  return {
    assignedTo: {
      objectId: route.get("assignedTo")?.id,
      username: route.get("assignedTo")?.get("username"),
    },
    scheduledDate: route.get("scheduledDate"),
    objectId: route.id,
    addedBy: {
      objectId: route.get("addedBy")?.id,
      username: route.get("addedBy")?.get("username"),
    },
    locality: route.get("locality"),
    routeState: {
      objectId: route.get("routeState")?.id,
      name: route.get("routeState")?.get("name"),
    },
    routeFactory: { name: route.get("routeFactory")?.get("name") },
    visits: visits.map((vzit) => {
      return {
        client: {
          objectId: vzit.get("client")?.id,
          fullName: vzit.get("client")?.get("fullName"),
        },
        type: {
          name: vzit.get("type")?.get("name"),
          objectId: vzit.get("type")?.id,
        },
        clientState: {
          objectId: vzit.get("clientState")?.id,
          name: vzit.get("clientState")?.get("name"),
        },
        gps: vzit.get("gps"),
        note: vzit.get("note"),
        isVisited: vzit.get("isVisited"),
        objectId: vzit.id,
      };
    }),
  };
};

export const deleteVisit = async (visitId: string) => {
  const query = new Parse.Query("Visit");
  query.equalTo("objectId", visitId);
  const visit = await query.first();
  await visit?.destroy();
};

//! Configs
export const createConfig = async (
  modelName: RouteModelNames,
  att: ISettingsParm
) => {
  const Config: ObjectConstructor = Parse.Object.extend(modelName);
  const config = new Config();
  config.set("name", att.name);
  await config.save();
};

export const getConfigs = async (modelName: RouteModelNames) => {
  const query = new Parse.Query(modelName);
  const result = await query.find();
  const configs: ISettingsParm[] = result?.map((conf) => ({
    name: conf.get("name"),
    objectId: conf.id,
  }));
  return configs;
};

export const getConfigPointer = async (
  modelName: RouteModelNames,
  objectId: string
) => {
  const query = new Parse.Query(modelName);
  query.equalTo("objectId", objectId);
  const result = await query.first();

  return result;
};

export const updateConfig = async (
  modelName: RouteModelNames,
  conf: ISettingsParm
) => {
  const query = new Parse.Query(modelName);
  query.equalTo("objectId", conf.objectId);
  const result = await query.first();

  result.set("name", conf.name);
  await result.save();
};

export const deleteConfig = async (
  modelName: RouteModelNames | "type",
  confId: string
) => {
  const query = new Parse.Query(modelName);
  query.equalTo("objectId", confId);
  const result = await query.first();

  if (modelName === RouteModelNames.visitType) {
    modelName = "type"; // a bug fix for naming issues
  }

  if (modelName === RouteModelNames.routeState) {
    const routeQuery = new Parse.Query("Route");
    routeQuery.equalTo(modelName, result);
    const routes = await routeQuery.first();
    if (routes === undefined) {
      await result.destroy();
    } else {
      throw new Error("vous ne pouvez pas supprimer cet élément");
    }
  } else {
    const visitQuery = new Parse.Query("Visit");
    visitQuery.equalTo(modelName, result);
    const visits = await visitQuery.first();
    if (visits === undefined) {
      await result.destroy();
    } else {
      throw new Error("vous ne pouvez pas supprimer cet élément");
    }
  }
};
