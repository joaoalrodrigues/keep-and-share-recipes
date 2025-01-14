import database from "infra/database";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const [databaseVersionResult, maxConnectionsResult] = await database.query(
    "SHOW server_version; SHOW max_connections;",
  );
  const databaseVersion = databaseVersionResult.rows[0].server_version;
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}
