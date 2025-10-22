const createExperienceTable = `
  CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(255),
    company VARCHAR(255),
    role VARCHAR(255),
    duration VARCHAR(255),
    details TEXT
  );
`;

module.exports = {
  createExperienceTable,
};
