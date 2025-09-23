import { createRouter } from "next-connect";
import recipe from "models/recipe";
import controller from "infra/controller";

const router = createRouter();

router.post(handlePost);

export default router.handler(controller.errorHandlers);

async function handlePost(request, response) {
  const recipeInputValues = request.body;
  const newRecipe = await recipe.create(recipeInputValues);

  return response.status(201).json(newRecipe);
}
