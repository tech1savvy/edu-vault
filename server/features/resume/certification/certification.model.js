const pool = require("../../../helpers/pool");

const getCertifications = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM certification WHERE user_id = $1', [user_id]);
  return rows;
};

const addCertification = async ({ user_id, name, issuer, date, credentialId }) => {
  const { rows } = await pool.query(
    'INSERT INTO certification (user_id, name, issuer, date, credentialId) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
    [user_id, name, issuer, date, credentialId]
  );
  return rows[0];
};

const updateCertification = async (id, { name, issuer, date, credentialId }) => {
  const { rows } = await pool.query(
    'UPDATE certification SET name = $1, issuer = $2, date = $3, credentialId = $4 WHERE id = $5 RETURNING * ',
    [name, issuer, date, credentialId, id]
  );
  return rows[0];
};

const deleteCertification = async (id) => {
  await pool.query('DELETE FROM certification WHERE id = $1', [id]);
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};
