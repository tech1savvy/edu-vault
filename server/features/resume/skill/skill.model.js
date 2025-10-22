const pool = require("pool");

const getSkills = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM skill WHERE user_id = $1', [user_id]);
  return rows;
};

const addSkill = async ({ user_id, name, level }) => {
  const { rows } = await pool.query(
    'INSERT INTO skill (user_id, name, level) VALUES ($1, $2, $3) RETURNING * ',
    [user_id, name, level]
  );
  return rows[0];
};

const updateSkill = async (id, { name, level }) => {
  const { rows } = await pool.query(
    'UPDATE skill SET name = $1, level = $2 WHERE id = $3 RETURNING * ',
    [name, level, id]
  );
  return rows[0];
};

const deleteSkill = async (id) => {
  await pool.query('DELETE FROM skill WHERE id = $1', [id]);
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};
