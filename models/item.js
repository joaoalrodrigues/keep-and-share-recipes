import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(itemInputValues) {
  validateRequiredValues(itemInputValues);

  const result = await runInsertQuery(itemInputValues);

  return result.rows[0];

  async function runInsertQuery(itemInputValues) {
    return await database.query({
      text: `
        INSERT INTO
          items (name, type, base_unit)
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        itemInputValues.name,
        itemInputValues.type,
        itemInputValues.baseUnit,
      ],
    });
  }
}

function validateRequiredValues(itemInputValues) {
  const requiredFields = ["name", "type", "baseUnit"];
  const missingFields = requiredFields.filter(
    (field) => !(field in itemInputValues),
  );

  if (missingFields.length > 0) {
    throw new ValidationError({
      message: "Invalid data. Missing required fields.",
      action: "Check the required fields and try again.",
    });
  }
}

const item = { create };

export default item;
