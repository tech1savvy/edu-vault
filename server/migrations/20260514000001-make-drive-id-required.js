'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;

    // Delete orphaned job descriptions that have no drive
    await sequelize.query(`DELETE FROM "JobDescriptions" WHERE drive_id IS NULL`);

    // Make drive_id NOT NULL with CASCADE on delete
    await sequelize.query(`
      ALTER TABLE "JobDescriptions"
      ALTER COLUMN drive_id SET NOT NULL;
    `);

    // Update FK to cascade
    await sequelize.query(`
      ALTER TABLE "JobDescriptions"
      DROP CONSTRAINT IF EXISTS "JobDescriptions_drive_id_fkey",
      ADD CONSTRAINT "JobDescriptions_drive_id_fkey"
        FOREIGN KEY (drive_id) REFERENCES "Drives"(id)
        ON DELETE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "JobDescriptions"
      ALTER COLUMN drive_id DROP NOT NULL;
    `);
    await sequelize.query(`
      ALTER TABLE "JobDescriptions"
      DROP CONSTRAINT IF EXISTS "JobDescriptions_drive_id_fkey",
      ADD CONSTRAINT "JobDescriptions_drive_id_fkey"
        FOREIGN KEY (drive_id) REFERENCES "Drives"(id)
        ON DELETE SET NULL;
    `);
  }
};
