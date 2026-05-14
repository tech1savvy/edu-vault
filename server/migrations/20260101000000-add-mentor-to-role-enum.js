'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
    console.log('Rollback: mentor value remains in enum_Users_role (Postgres limitation).');
  },
};
