import { resolve } from "path";
import migrationRunner from "node-pg-migrate";
import database from "/infra/database";
import { createRouter } from "next-connect";
import { onErrorHandler, onNoMatchHandler } from "infra/middlewares";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

const getDefaultMigrationOptions = (dbClient) => ({
  dbClient,
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
});

async function getHandler(_, response) {
  const dbClient = await database.getNewClient();
  const migrationOptions = getDefaultMigrationOptions(dbClient);
  const pendingMigrations = await migrationRunner(migrationOptions);

  dbClient.end();

  response.status(200).json(pendingMigrations);
}

async function postHandler(_, response) {
  const dbClient = await database.getNewClient();
  const migrationOptions = getDefaultMigrationOptions(dbClient);
  const migratedMigrations = await migrationRunner({
    ...migrationOptions,
    dryRun: false,
  });

  dbClient.end();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
