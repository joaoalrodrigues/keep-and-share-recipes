import bcryptjs from "bcryptjs";

async function hash(plainTextPassword) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(plainTextPassword, rounds);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(plainTextPassword, hashedPassword) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
