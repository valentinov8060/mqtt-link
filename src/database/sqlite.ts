import * as SQLite from "expo-sqlite";

export async function getDB() {
  try {
    const db = await SQLite.openDatabaseAsync("mqtt-link");
    return db;
  } catch (error) {
    console.error("getDB Error: ", error);
    throw new Error("getDB Error:" + (error as any));
  }
}

export default getDB;
