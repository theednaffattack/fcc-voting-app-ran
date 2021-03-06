/*eslint-disable */

const HEADER_REGEX = /Bearer token-(.*)$/;

// const valid = await bcrypt.compare(password, user.password);

/**
 * This is an extremely simple token. In real applications make
 * sure to use a better one, such as JWT (https://jwt.io/).
 */
module.exports.authenticate = async ({ headers: { authorization } }, Users) => {
  console.log(authorization);
  const email = authorization && HEADER_REGEX.exec(authorization)[1];
  return email && (await Users.findOne({ email }));
};
/* eslint-enable */
