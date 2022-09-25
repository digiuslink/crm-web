import Parse, { ObjectConstructor } from "parse";

interface IConfig {
  name: string;
  title: string;
  attributes: string[];
}

export const addConfigs = async (configs: IConfig[]) => {
  const Configs: ObjectConstructor = Parse.Object.extend("Configs");
  const query = new Parse.Query(Configs);
  query.equalTo("name", configs[0]?.name);
  const config = await query.first();
  if (config) {
    configs.forEach((cfg) => config.set(cfg.title, cfg.attributes));
    return await config.save();
  } else {
    const _config = new Configs();
    _config.set("name", configs[0]?.name);
    configs.forEach((cfg) => _config.set(cfg.title, cfg.attributes));
    return await _config.save();
  }
};

export const getConfigs = async (name: string) => {
  const Configs: ObjectConstructor = Parse.Object.extend("Configs");
  const query = new Parse.Query(Configs);
  query.equalTo("name", name);
  return (await query.first())?.toJSON();
};

// Check config for delete
export const checkConfigExist = async (config: string, attribute: string) => {
  if (!attribute) {
    return false;
  }
  const Client: ObjectConstructor = Parse.Object.extend("Client");
  const query = new Parse.Query(Client);
  query.equalTo(config, attribute);
  const client = await query.first();
  if (client) return true;
  else return false;
};
