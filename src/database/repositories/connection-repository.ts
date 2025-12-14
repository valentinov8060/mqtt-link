import { ConnectionModel } from "@/src/database/models/connection-model";
import getDB from "@/src/database/sqlite";

export async function addConnection(
  connection: ConnectionModel
): Promise<null> {
  try {
    const tlsValue = connection.tls ? 1 : 0;
    const autoReconnectValue = connection.autoReconnect ? 1 : 0;

    const sql = `
      INSERT INTO connections 
        (protocol, host, port, tls, username, password, autoReconnect)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?);
    `;
    const params = [
      connection.protocol,
      connection.host,
      connection.port,
      tlsValue,
      connection.username || null,
      connection.password || null,
      autoReconnectValue,
    ];

    const db = await getDB();
    await db.runAsync(sql, params);

    console.log(`addConnection executed successfully`);
    return null;
  } catch (error) {
    console.error("addConnection Error: ", error);
    throw new Error("addConnection Error:" + (error as any));
  }
}

export async function getConnections(): Promise<ConnectionModel[]> {
  try {
    const db = await getDB();

    const rawConnections: any[] = await db.getAllAsync(
      `SELECT * FROM connections;`
    );

    const connections: ConnectionModel[] = rawConnections.map((rawConn) => {
      return {
        ...rawConn,
        tls: !!rawConn.tls,
        autoReconnect: !!rawConn.autoReconnect,
      } as ConnectionModel;
    });

    console.log("getConnections executed successfully");
    return connections;
  } catch (error) {
    console.error("getConnections Error: ", error);
    throw new Error("getConnections Error:" + (error as any));
  }
}

export async function updateConnection(
  connection: ConnectionModel
): Promise<null> {
  try {
    const idValue = connection.id;
    if (idValue === undefined || idValue === null) {
      throw new Error("updateConnection Error: id is required");
    }

    const tlsValue = connection.tls ? 1 : 0;
    const autoReconnectValue = connection.autoReconnect ? 1 : 0;
    const sql = `
      UPDATE connections 
      SET 
        protocol = ?,
        host = ?,
        port = ?,
        tls = ?,
        username = ?,
        password = ?,
        autoReconnect = ?
      WHERE id = ?;
    `;
    const params = [
      connection.protocol,
      connection.host,
      connection.port,
      tlsValue,
      connection.username || null,
      connection.password || null,
      autoReconnectValue,
      idValue,
    ];

    const db = await getDB();
    await db.runAsync(sql, params);

    console.log(`updateConnection executed successfully`);
    return null;
  } catch (error) {
    console.error("updateConnection Error: ", error);
    throw new Error("updateConnection Error:" + (error as any));
  }
}
