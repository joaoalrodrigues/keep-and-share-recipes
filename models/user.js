import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userInputData) {
  await validateUniqueUsername(userInputData.username);
  await validateUniqueEmail(userInputData.email);
  await hashPasswordInObject(userInputData);

  const result = await runInsertQuery();

  return result.rows[0];

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
      values: [
        userInputData.username,
        userInputData.email,
        userInputData.password,
      ],
    });
  }
}

async function update(username, userInputValues) {
  const storedUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { storedUser, ...userInputValues };

  const result = await runUpdateQuery(userWithNewValues);

  return result.rows[0];

  async function runUpdateQuery(userWithNewValues) {
    return await database.query({
      text: `
        UPDATE
          users
        SET 
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [
        storedUser.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
  }
}

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

async function findOneByUsername(username) {
  const result = await database.query({
    text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT 1
    ;`,
    values: [username],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "User not found.",
      action: "Verify the username and try again.",
    });
  }

  return result.rows[0];
}

async function findOneByEmail(email) {
  const result = await database.query({
    text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT 1
    ;`,
    values: [email],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "User not found.",
      action: "Verify the email and try again.",
    });
  }

  return result.rows[0];
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = { create, update, findOneByUsername, findOneByEmail };

export default user;
