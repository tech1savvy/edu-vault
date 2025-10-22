const pool = require("pool");

const getHeading = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM heading WHERE user_id = $1', [user_id]);
  return rows[0];
};

const createOrUpdateHeading = async ({ user_id, name, role, email, phone, location, link }) => {
  const { rows } = await pool.query(
    'INSERT INTO heading (user_id, name, role, email, phone, location, link) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO UPDATE SET name = $2, role = $3, email = $4, phone = $5, location = $6, link = $7 RETURNING * ',
    [user_id, name, role, email, phone, location, link]
  );
  return rows[0];
};

module.exports = {
  getHeading,
  createOrUpdateHeading,
};
