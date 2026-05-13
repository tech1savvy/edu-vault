'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Postgres enums cannot use IF NOT EXISTS before v12 via ALTER TYPE,
    // so we check first then add safely.
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'mentor'
          AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'enum_Users_role'
          )
        ) THEN
          ALTER TYPE "enum_Users_role" ADD VALUE 'mentor';
        END IF;
      END
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Postgres does not support removing values from an enum natively.
    // To roll back: recreate the enum without 'mentor' and update the column.
    // This is left as a no-op to avoid destructive data loss.
    console.log('Rollback: mentor value remains in enum_Users_role (Postgres limitation).');
  },
};
