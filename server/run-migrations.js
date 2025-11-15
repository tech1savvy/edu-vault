const { exec } = require('child_process');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

console.log('Running migrations with DB_USER:', process.env.DB_USER);

const migrate = exec(
  'npx sequelize-cli db:migrate',
  { env: process.env },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  }
);
