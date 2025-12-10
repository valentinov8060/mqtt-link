import getDB from "@/src/database/sqlite";

export async function initConnections() {
  try {
    const db = await getDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host TEXT NOT NULL,
        port INTEGER NOT NULL,
        protocol TEXT,
        ssl INTEGER DEFAULT 0,
        username TEXT,
        password TEXT,
        autoReconnect INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS connections_updated_at
      AFTER UPDATE ON connections
      FOR EACH ROW
      BEGIN
        UPDATE connections SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);

    console.log("initConnections executed successfully.");
  } catch (error) {
    throw new Error("initConnections Error:" + (error as any));
  }
}
