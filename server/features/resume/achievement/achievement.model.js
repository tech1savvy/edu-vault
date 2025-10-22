const pool = require("../../../helpers/pool");

const getAchievements = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM achievement WHERE user_id = $1', [user_id]);
  return rows;
};

const addAchievement = async ({ user_id, title, description, date }) => {
  const { rows } = await pool.query(
    'INSERT INTO achievement (user_id, title, description, date) VALUES ($1, $2, $3, $4) RETURNING * ',
    [user_id, title, description, date]
  );
  return rows[0];
};

const updateAchievement = async (id, { title, description, date }) => {
  const { rows } = await pool.query(
    'UPDATE achievement SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING * ',
    [title, description, date, id]
  );
  return rows[0];
};

const deleteAchievement = async (id) => {
  await pool.query('DELETE FROM achievement WHERE id = $1', [id]);
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};
