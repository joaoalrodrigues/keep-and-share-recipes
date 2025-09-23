import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/items", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Tomato",
          type: "input",
          baseUnit: "kg",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Tomato",
        type: "input",
        base_unit: "kg",
      });
    });
    test("With missing `name`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "input",
          baseUnit: "kg",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid data. Missing required fields.",
        action: "Check the required fields and try again.",
        status_code: 400,
      });
    });
    test("With missing `base_unit`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Lettuce",
          type: "input",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid data. Missing required fields.",
        action: "Check the required fields and try again.",
        status_code: 400,
      });
    });
    test("With missing `type`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Lettuce",
          baseUnit: "kg",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Invalid data. Missing required fields.",
        action: "Check the required fields and try again.",
        status_code: 400,
      });
    });
  });
});
