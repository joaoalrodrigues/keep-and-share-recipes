import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create({ username, email, password }) {
  await validateUniqueUsername(username);
  await validateUniqueEmail(email);

  const result = await runInsertQuery();

  return result.rows[0];

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
      `,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username already in use.",
        action: "Provide a different username and try again.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      `,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email already in use.",
        action: "Provide a different email and try again.",
      });
    }
  }

  async function runInsertQuery() {
    return await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [username, email, password],
    });
  }
}

const user = { create };

export default user;
