import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export default function getDB() {
  dbPromise ??= SQLite.openDatabaseAsync("mqtt-link");
  return dbPromise;
}
