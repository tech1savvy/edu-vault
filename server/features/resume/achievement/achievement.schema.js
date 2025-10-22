const createAchievementTable = `
  CREATE TABLE IF NOT EXISTS achievement (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    date VARCHAR(255)
  );
`;

module.exports = {
  createAchievementTable,
};
