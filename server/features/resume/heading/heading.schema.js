const createHeadingTable = `
  CREATE TABLE IF NOT EXISTS heading (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    name VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    location VARCHAR(255),
    link VARCHAR(255)
  );
`;

module.exports = {
  createHeadingTable,
};
