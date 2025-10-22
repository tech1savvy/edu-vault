const pool = require("pool");

const getProjects = async ({ user_id }) => {
  const { rows } = await pool.query('SELECT * FROM project WHERE user_id = $1', [user_id]);
  return rows;
};

const addProject = async ({ user_id, title, description, techStack, timeline, type, collaborators }) => {
  const { rows } = await pool.query(
    'INSERT INTO project (user_id, title, description, techStack, timeline, type, collaborators) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
    [user_id, title, description, techStack, timeline, type, collaborators]
  );
  return rows[0];
};

const updateProject = async (id, { title, description, techStack, timeline, type, collaborators }) => {
  const { rows } = await pool.query(
    'UPDATE project SET title = $1, description = $2, techStack = $3, timeline = $4, type = $5, collaborators = $6 WHERE id = $7 RETURNING * ',
    [title, description, techStack, timeline, type, collaborators, id]
  );
  return rows[0];
};

const deleteProject = async (id) => {
  await pool.query('DELETE FROM project WHERE id = $1', [id]);
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
