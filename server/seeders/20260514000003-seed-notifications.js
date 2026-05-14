'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const may10 = new Date('2026-05-10');
    const may12 = new Date('2026-05-12');
    const may15 = new Date('2026-05-15');
    const may18 = new Date('2026-05-18');
    const may20 = new Date('2026-05-20');

    await queryInterface.bulkInsert('Notifications', [
      // John (user 1) - Google SWE progress
      { id: 1, user_id: 1, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Google SWE Intern.', type: 'stage_update', is_read: true, related_id: 1, createdAt: may12, updatedAt: may12 },
      { id: 2, user_id: 1, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Google SWE Intern.', type: 'selection', is_read: false, related_id: 1, createdAt: may15, updatedAt: may15 },
      { id: 3, user_id: 1, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Google SWE Intern.', type: 'stage_update', is_read: false, related_id: 1, createdAt: may15, updatedAt: may15 },
      { id: 4, user_id: 1, title: 'Congratulations!', message: 'You have been shortlisted from "Technical Interview" round for Google SWE Intern.', type: 'selection', is_read: false, related_id: 1, createdAt: may20, updatedAt: may20 },
      { id: 5, user_id: 1, title: 'Moved to Next Round', message: 'You have been moved to "HR Interview" round for Google SWE Intern.', type: 'stage_update', is_read: false, related_id: 1, createdAt: may20, updatedAt: may20 },

      // John (user 1) - MS SDE selected!
      { id: 6, user_id: 1, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Microsoft SDE Intern.', type: 'stage_update', is_read: true, related_id: 2, createdAt: may10, updatedAt: may10 },
      { id: 7, user_id: 1, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Microsoft SDE Intern.', type: 'selection', is_read: true, related_id: 2, createdAt: may15, updatedAt: may15 },
      { id: 8, user_id: 1, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Microsoft SDE Intern.', type: 'stage_update', is_read: true, related_id: 2, createdAt: may15, updatedAt: may15 },
      { id: 9, user_id: 1, title: 'Selected!', message: 'Congratulations! You have been selected for Microsoft SDE Intern position!', type: 'selection', is_read: false, related_id: 2, createdAt: may20, updatedAt: may20 },

      // Jane (user 2) - Google DE eliminated
      { id: 10, user_id: 2, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Google Data Engineer Intern.', type: 'stage_update', is_read: true, related_id: 3, createdAt: may12, updatedAt: may12 },
      { id: 11, user_id: 2, title: 'Application Update', message: 'You have been eliminated after "Technical Interview" round for Google Data Engineer Intern.', type: 'elimination', is_read: false, related_id: 3, createdAt: may15, updatedAt: may15 },

      // Peter (user 3) - MS SDE in progress
      { id: 12, user_id: 3, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Microsoft SDE Intern.', type: 'stage_update', is_read: true, related_id: 4, createdAt: may12, updatedAt: may12 },
      { id: 13, user_id: 3, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Microsoft SDE Intern.', type: 'selection', is_read: true, related_id: 4, createdAt: may18, updatedAt: may18 },
      { id: 14, user_id: 3, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Microsoft SDE Intern.', type: 'stage_update', is_read: false, related_id: 4, createdAt: may18, updatedAt: may18 },

      // Michael (user 5) - MS PM eliminated
      { id: 15, user_id: 5, title: 'Application Update', message: 'You have been eliminated after "Online Assessment" round for Microsoft PM Intern.', type: 'elimination', is_read: false, related_id: 5, createdAt: may15, updatedAt: may15 },

      // Sarah (user 6) - Amazon in progress
      { id: 16, user_id: 6, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Amazon SDE.', type: 'stage_update', is_read: true, related_id: 6, createdAt: may18, updatedAt: may18 },
      { id: 17, user_id: 6, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Amazon SDE.', type: 'selection', is_read: false, related_id: 6, createdAt: may20, updatedAt: may20 },
      { id: 18, user_id: 6, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Amazon SDE.', type: 'stage_update', is_read: false, related_id: 6, createdAt: may20, updatedAt: may20 },

      // David (user 7) - Amazon Cloud at OA
      { id: 19, user_id: 7, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Amazon Cloud Engineer.', type: 'stage_update', is_read: false, related_id: 7, createdAt: may18, updatedAt: may18 },

      // Laura (user 8) - Google DE + Amazon SDE in progress
      { id: 20, user_id: 8, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Google Data Engineer Intern.', type: 'stage_update', is_read: true, related_id: 8, createdAt: may12, updatedAt: may12 },
      { id: 21, user_id: 8, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Google Data Engineer Intern.', type: 'selection', is_read: true, related_id: 8, createdAt: may15, updatedAt: may15 },
      { id: 22, user_id: 8, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Google Data Engineer Intern.', type: 'stage_update', is_read: true, related_id: 8, createdAt: may15, updatedAt: may15 },
      { id: 23, user_id: 8, title: 'Congratulations!', message: 'You have been shortlisted from "Technical Interview" round for Google Data Engineer Intern.', type: 'selection', is_read: false, related_id: 8, createdAt: may18, updatedAt: may18 },
      { id: 24, user_id: 8, title: 'Moved to Next Round', message: 'You have been moved to "HR Interview" round for Google Data Engineer Intern.', type: 'stage_update', is_read: false, related_id: 8, createdAt: may18, updatedAt: may18 },
      { id: 25, user_id: 8, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Amazon SDE.', type: 'stage_update', is_read: false, related_id: 9, createdAt: may18, updatedAt: may18 },

      // Daniel (user 10) - Google DE + Amazon SDE
      { id: 26, user_id: 10, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Google Data Engineer Intern.', type: 'stage_update', is_read: true, related_id: 10, createdAt: may20, updatedAt: may20 },
      { id: 27, user_id: 10, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Google Data Engineer Intern.', type: 'selection', is_read: false, related_id: 10, createdAt: may20, updatedAt: may20 },
      { id: 28, user_id: 10, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Google Data Engineer Intern.', type: 'stage_update', is_read: false, related_id: 10, createdAt: may20, updatedAt: may20 },
      { id: 29, user_id: 10, title: 'Stage Update', message: 'You have been moved to "Online Assessment" round for Amazon SDE.', type: 'stage_update', is_read: true, related_id: 11, createdAt: may20, updatedAt: may20 },
      { id: 30, user_id: 10, title: 'Congratulations!', message: 'You have been shortlisted from "Online Assessment" round for Amazon SDE.', type: 'selection', is_read: true, related_id: 11, createdAt: may20, updatedAt: may20 },
      { id: 31, user_id: 10, title: 'Moved to Next Round', message: 'You have been moved to "Technical Interview" round for Amazon SDE.', type: 'stage_update', is_read: true, related_id: 11, createdAt: may20, updatedAt: may20 },
      { id: 32, user_id: 10, title: 'Congratulations!', message: 'You have been shortlisted from "Technical Interview" round for Amazon SDE.', type: 'selection', is_read: false, related_id: 11, createdAt: may20, updatedAt: may20 },
      { id: 33, user_id: 10, title: 'Moved to Next Round', message: 'You have been moved to "HR Interview" round for Amazon SDE.', type: 'stage_update', is_read: false, related_id: 11, createdAt: may20, updatedAt: may20 },
    ]);

    await queryInterface.sequelize.query(`SELECT setval('"Notifications_id_seq"', (SELECT MAX(id) FROM "Notifications"))`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};
