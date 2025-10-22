const pool = require("pool");

const getExperiences = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM experience WHERE user_id = $1', [user_id]);
  return rows;
};

const addExperience = async ({ user_id, type, company, role, duration, details }) => {
  const { rows } = await pool.query(
    'INSERT INTO experience (user_id, type, company, role, duration, details) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ',
    [user_id, type, company, role, duration, details]
  );
  return rows[0];
};

const updateExperience = async (id, { type, company, role, duration, details }) => {
  const { rows } = await pool.query(
    'UPDATE experience SET type = $1, company = $2, role = $3, duration = $4, details = $5 WHERE id = $6 RETURNING * ',
    [type, company, role, duration, details, id]
  );
  return rows[0];
};

const deleteExperience = async (id) => {
  await pool.query('DELETE FROM experience WHERE id = $1', [id]);
};

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
};
