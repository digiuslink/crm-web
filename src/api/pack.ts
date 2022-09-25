import Parse, { ObjectConstructor } from "parse";
import { IBlfItem } from "../pages/BLFs/blfSlice";

export interface IPack {
  blfItems: IBlfItem[];
  packName: string;
  objectId?: string;
}

export const addPack = async (pack: IPack) => {
  const Pack: ObjectConstructor = Parse.Object.extend("Pack");
  const _pack = new Pack();
  await _pack.save({ ...pack });
};

export const updatePack = async (pack: IPack) => {
  const query = new Parse.Query("Pack");
  query.equalTo("objectId", pack.objectId);
  const _pack = await query.first();
  await _pack.save({ ...pack });
};

export const deletePack = async (packId: string) => {
  const query = new Parse.Query("Pack");
  query.equalTo("objectId", packId);
  const _pack = await query.first();
  await _pack.destroy();
};

export const getPacks = async () => {
  const query = new Parse.Query("Pack");
  const result = await query.findAll();
  const packs: IPack[] = result.map((item) => {
    const _item: IPack = {
      objectId: item.id,
      packName: item.get("packName"),
      blfItems: item.get("blfItems"),
    };
    return _item;
  });
  return packs;
};
