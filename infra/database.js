import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Database connection or Query error.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return process.env.POSTGRES_CA;
  }
  return ["development", "test"].includes(process.env.NODE_ENV) ? false : true;
}

const database = {
  query,
  getNewClient,
};

export default database;
