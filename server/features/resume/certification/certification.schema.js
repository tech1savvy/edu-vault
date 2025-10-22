const createCertificationTable = `
  CREATE TABLE IF NOT EXISTS certification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    issuer VARCHAR(255),
    date VARCHAR(255),
    credentialId VARCHAR(255)
  );
`;

module.exports = {
  createCertificationTable,
};
