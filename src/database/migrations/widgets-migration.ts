import getDB from "@/src/database/sqlite";

export async function initWidgets() {
  try {
    const db = await getDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS widgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        topic TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS widgets_updated_at
      AFTER UPDATE ON widgets
      FOR EACH ROW
      BEGIN
        UPDATE widgets SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);

    console.log("initWidgets executed successfully");
  } catch (error) {
    console.error("initWidgets Error: ", error);
    throw new Error("initWidgets Error:" + (error as any));
  }
}
