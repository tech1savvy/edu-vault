const createEducationTable = `
  CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    institution VARCHAR(255),
    degree VARCHAR(255),
    fieldOfStudy VARCHAR(255),
    duration VARCHAR(255),
    details TEXT
  );
`;

module.exports = {
  createEducationTable,
};
