import user from "models/user";
import password from "models/password";
import { UnauthorizedError, NotFoundError } from "infra/errors";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const userStored = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, userStored.password);

    return userStored;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Invalid data. Unable to authenticate user.",
        action: "Check your credentials and try again.",
      });
    }

    throw error;
  }
}

async function findUserByEmail(email) {
  let storedUser;
  try {
    storedUser = await user.findOneByEmail(email);
    return storedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Invalid email.",
        action: "Check your email and try again.",
      });
    }

    throw error;
  }
}

async function validatePassword(providedPassword, hashedPassword) {
  const passwordMatch = await password.compare(
    providedPassword,
    hashedPassword,
  );

  if (!passwordMatch) {
    throw new UnauthorizedError({
      message: "Invalid password.",
      action: "Check your password and try again.",
    });
  }
}

const authentication = { getAuthenticatedUser };

export default authentication;
