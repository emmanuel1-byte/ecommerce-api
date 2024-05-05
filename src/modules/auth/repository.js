import { logger } from "../../utils/logger.js";
import { Token, User } from "./model.js";

async function create(data) {
  try {
    return await User.create({
      email: data.email,
      role: data.role,
      password: data.password,
    });
  } catch (err) {
    logger.error(err.message);
  }
}

async function findUserByEmail(email) {
  try {
    return await User.findOne({ where: { email: email } });
  } catch (err) {
    logger.error(err.message);
  }
}

async function findToken(token) {
  try {
    return await Token.findOne({ token: token });
  } catch (err) {
    logger.error(err.message);
  }
}

async function markAccountAsVerified(userId) {
  try {
    return await User.update({ verified: true }, { where: { id: userId } });
  } catch (err) {
    logger.error(err.message);
  }
}

async function deleteToken(token) {
  try {
    return await Token.destroy({ where: { token: token }, force: true });
  } catch (err) {
    logger.error(err.message);
  }
}

export const repository = {
  create,
  findUserByEmail,
  findToken,
  markAccountAsVerified,
  deleteToken
};
