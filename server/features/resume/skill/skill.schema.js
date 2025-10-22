const createSkillTable = `
  CREATE TABLE IF NOT EXISTS skill (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    level VARCHAR(255)
  );
`;

module.exports = {
  createSkillTable,
};
