import { createRouter } from "next-connect";
import user from "models/user";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const foundUser = await user.findOneByUsername(username);

  return response.status(200).json(foundUser);
}

async function patchHandler(request, response) {
  const userInputData = request.body;
  const username = request.query.username;
  const updatedUser = await user.update(username, userInputData);

  return response.status(200).json(updatedUser);
}
