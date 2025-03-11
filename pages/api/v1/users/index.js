import { createRouter } from "next-connect";
import user from "models/user";
import controller from "infra/controller";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputData = request.body;
  const newUser = await user.create(userInputData);

  return response.status(201).json(newUser);
}
