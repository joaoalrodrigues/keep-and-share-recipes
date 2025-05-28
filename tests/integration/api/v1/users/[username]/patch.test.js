import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unexisting username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/unexistingUser",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "newUser",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found.",
        action: "Verify the username and try again.",
        status_code: 404,
      });
    });

    test("With duplicated username", async () => {
      await orchestrator.createUser({
        username: "duplicated",
      });

      const storedUser2 = await orchestrator.createUser({
        username: "uniqueUser",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${storedUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "duplicated",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username already in use.",
        action: "Provide a different username and try again.",
        status_code: 400,
      });
    });

    test("With duplicated email", async () => {
      await orchestrator.createUser({
        username: "duplicatedEmail1",
        email: "duplicatedEmail1@gmail.com",
        password: "weakpassword123",
      });

      const user2 = await orchestrator.createUser({
        username: "duplicatedEmail2",
        email: "duplicatedEmail2@gmail.com",
        password: "weakpassword123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "DuplicatedEmail1@gmail.com",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email already in use.",
        action: "Provide a different email and try again.",
        status_code: 400,
      });
    });

    test("With valid data", async () => {
      const createdUser = await orchestrator.createUser({
        username: "validUser",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "newValidUser",
            email: "valid-email@gmail.com",
            password: "newStrongPassword123",
          }),
        },
      );

      expect(response.status).toBe(200);
    });
  });
});
