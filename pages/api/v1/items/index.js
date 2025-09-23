import { createRouter } from "next-connect";
import item from "models/item";
import controller from "infra/controller";

const router = createRouter();

router.post(handlePost);

export default router.handler(controller.errorHandlers);

async function handlePost(request, response) {
  const itemInputValues = request.body;
  const newItem = await item.create(itemInputValues);

  return response.status(201).json(newItem);
}
