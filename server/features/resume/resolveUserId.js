/**
 * Sequelize models use the attribute name `userId` (DB column `user_id`).
 * Callers still pass `user_id` from controllers — normalize here so queries match rows.
 */
const resolveUserId = (params) => {
  if (params == null) return undefined;
  return params.userId ?? params.user_id;
};

module.exports = { resolveUserId };
