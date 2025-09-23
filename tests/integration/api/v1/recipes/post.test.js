import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/recipes", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const createdItem = await orchestrator.createItem({
        name: "Tomato",
        type: "input",
        baseUnit: "kg",
      });

      const response = await fetch("http://localhost:3000/api/v1/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: createdItem.id,
          yieldQuantity: "10.50",
          preparationMethod: "Chop and mix",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        product_id: createdItem.id,
        yield_quantity: "10.50",
        preparation_method: "Chop and mix",
        lines: [],
      });
    });
    test("With missing `product_id`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yieldQuantity: "10.50",
          preparationMethod: "Chop and mix",
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
    test("With missing `yield_quantity`", async () => {
      const createdItem = await orchestrator.createItem();

      const response = await fetch("http://localhost:3000/api/v1/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: createdItem.id,
          preparationMethod: "Chop and mix",
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
