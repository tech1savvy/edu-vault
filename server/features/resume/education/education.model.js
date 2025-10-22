const pool = require("../../../helpers/pool");

const getEducations = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM education WHERE user_id = $1', [user_id]);
  return rows;
};

const addEducation = async ({ user_id, institution, degree, fieldOfStudy, duration, details }) => {
  const { rows } = await pool.query(
    'INSERT INTO education (user_id, institution, degree, fieldOfStudy, duration, details) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ',
    [user_id, institution, degree, fieldOfStudy, duration, details]
  );
  return rows[0];
};

const updateEducation = async (id, { institution, degree, fieldOfStudy, duration, details }) => {
  const { rows } = await pool.query(
    'UPDATE education SET institution = $1, degree = $2, fieldOfStudy = $3, duration = $4, details = $5 WHERE id = $6 RETURNING * ',
    [institution, degree, fieldOfStudy, duration, details, id]
  );
  return rows[0];
};

const deleteEducation = async (id) => {
  await pool.query('DELETE FROM education WHERE id = $1', [id]);
};

module.exports = {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};
