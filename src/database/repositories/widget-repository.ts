import { WidgetModel } from "@/src/database/models/widget-model";
import getDB from "@/src/database/sqlite";

export async function addWidget(widgetBox: WidgetModel): Promise<null> {
  try {
    const db = await getDB();

    const countResult = await db.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) AS total FROM widgets`
    );

    if (countResult && countResult.total >= 5) {
      throw new Error("Widget limit reached. Maksimal 5 widget diperbolehkan.");
    }

    const sql = `
      INSERT INTO widgets 
        (name, topic)
      VALUES 
        (?, ?);
    `;
    const params = [widgetBox.name, widgetBox.topic];

    await db.runAsync(sql, params);

    console.log(`addWidget executed successfully`);
    return null;
  } catch (error) {
    throw new Error("addWidget Error:" + (error as any));
  }
}

export async function getWidgets(): Promise<WidgetModel[]> {
  try {
    const db = await getDB();
    const connections = await db.getAllAsync(`SELECT * FROM widgets;`);

    console.log("getWidgets executed successfully.");
    return connections as WidgetModel[];
  } catch (error) {
    throw new Error("getWidgets Error:" + (error as any));
  }
}

export async function deleteWidget(id: number): Promise<null> {
  try {
    const db = await getDB();
    await db.runAsync(`DELETE FROM widgets WHERE id = ${id} ;`);

    console.log("deleteWidget executed successfully.");
    return null;
  } catch (error) {
    throw new Error("deleteWidget Error:" + (error as any));
  }
}
