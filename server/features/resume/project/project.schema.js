const createProjectTable = `
  CREATE TABLE IF NOT EXISTS project (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    techStack VARCHAR(255),
    timeline VARCHAR(255),
    type VARCHAR(255),
    collaborators TEXT
  );
`;

module.exports = {
  createProjectTable,
};
