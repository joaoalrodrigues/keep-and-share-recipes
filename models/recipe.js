import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(recipeInputValues) {
  validateRequiredValues(recipeInputValues);

  const recipeResult = await runInsertRecipeQuery(recipeInputValues);
  const newRecipe = recipeResult.rows[0];

  const recipeLines = [];
  for (let line of recipeInputValues.lines || []) {
    const recipeLineResult = await runInsertRecipeLineQuery(newRecipe.id, line);
    const newRecipeLine = recipeLineResult.rows[0];

    recipeLines.push({
      inputId: newRecipeLine.input_id,
      quantityInBaseUnit: newRecipeLine.quantity_in_base_unit,
    });
  }

  newRecipe.lines = recipeLines;
  return newRecipe;

  async function runInsertRecipeQuery(recipeInputValues) {
    return await database.query({
      text: `
        INSERT INTO
          recipes (product_id, yield_quantity, preparation_method)
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        recipeInputValues.productId,
        recipeInputValues.yieldQuantity,
        recipeInputValues.preparationMethod,
      ],
    });
  }

  async function runInsertRecipeLineQuery(recipeId, recipeLine) {
    return await database.query({
      text: `
          INSERT INTO
            recipe_lines (recipe_id, input_id, quantity_in_base_unit)
          VALUES 
            ($1, $2, $3)
            RETURNING *
          ;`,
      values: [recipeId, recipeLine.inputId, recipeLine.quantityInBaseUnit],
    });
  }
}

function validateRequiredValues(itemInputValues) {
  const requiredFields = ["productId", "yieldQuantity"];
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

const recipe = { create };

export default recipe;
