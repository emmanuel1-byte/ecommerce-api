import { logger } from "../../utils/logger.js";
import { BlackList, Token, User } from "./model.js";

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

async function updatePassword(data) {
  try {
    return await User.update({ password: data.password }, { where: { email: data.email } })
  } catch (err) {
    logger.error(err.message);
  }
}

async function createToken(data) {
  try {
    return await Token.create({
      userId: data.userId,
      token: data.token,
      token_type: data.token_type,
      expiresIn: data.expiresIn,
    });
  } catch (err) {
    logger.error(err.message);
  }
}

async function findToken(token) {
  try {
    return await Token.findOne({ where: { token: token } });
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

async function createBlackList(token) {
  try {
    return await BlackList.create({ token: token })
  } catch (err) {
    logger.error(err.message);
  }
}

export const repository = {
  create,
  findUserByEmail,
  updatePassword,
  findToken,
  markAccountAsVerified,
  deleteToken,
  createToken,
  createBlackList
};
