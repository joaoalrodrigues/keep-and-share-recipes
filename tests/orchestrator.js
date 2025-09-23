import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "infra/database";
import migrator from "models/migrator";
import user from "models/user";
import item from "models/item";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userInputData) {
  const createdUser = await user.create({
    username: userInputData?.username || faker.internet.username(),
    email: userInputData?.email || faker.internet.email(),
    password: userInputData?.password || "strongpassword",
  });

  return createdUser;
}

async function createItem(itemInputData) {
  const createdItem = await item.create({
    name: itemInputData?.name || faker.food.dish(),
    type:
      itemInputData?.type || faker.helpers.arrayElement(["input", "product"]),
    baseUnit:
      itemInputData?.baseUnit ||
      faker.helpers.arrayElement(["kg", "g", "l", "ml", "unit"]),
  });

  return createdItem;
}

const orchestrator = {
  waitForAllServices,
  cleanDatabase,
  runPendingMigrations,
  createUser,
  createItem,
};

export default orchestrator;
