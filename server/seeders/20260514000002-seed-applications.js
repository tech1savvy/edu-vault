'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const may10 = new Date('2026-05-10');
    const may12 = new Date('2026-05-12');
    const may15 = new Date('2026-05-15');
    const may18 = new Date('2026-05-18');
    const may20 = new Date('2026-05-20');

    // ──────────────────────────────────────────────
    // Applications
    // ──────────────────────────────────────────────
    await queryInterface.bulkInsert('JobApplications', [
      // 1. John (1) → Google SWE (1) → HR stage
      { id: 1, job_id: 1, user_id: 1, status: 'reviewed', notes: null, applied_at: may10, current_stage_id: 3, createdAt: now, updatedAt: now },
      // 2. John (1) → MS SDE (3) → Final stage (selected)
      { id: 2, job_id: 3, user_id: 1, status: 'shortlisted', notes: 'Strong performance in all rounds', applied_at: may10, current_stage_id: 6, createdAt: now, updatedAt: now },
      // 3. Jane (2) → Google DE (2) → eliminated
      { id: 3, job_id: 2, user_id: 2, status: 'rejected', notes: 'Struggled with system design', applied_at: may12, current_stage_id: null, createdAt: now, updatedAt: now },
      // 4. Peter (3) → MS SDE (3) → Technical stage
      { id: 4, job_id: 3, user_id: 3, status: 'reviewed', notes: null, applied_at: may12, current_stage_id: 5, createdAt: now, updatedAt: now },
      // 5. Michael (5) → MS PM (4) → eliminated at OA
      { id: 5, job_id: 4, user_id: 5, status: 'rejected', notes: 'Did not meet the cut-off score', applied_at: may15, current_stage_id: null, createdAt: now, updatedAt: now },
      // 6. Sarah (6) → Amazon SDE (5) → Technical stage
      { id: 6, job_id: 5, user_id: 6, status: 'reviewed', notes: null, applied_at: may18, current_stage_id: 8, createdAt: now, updatedAt: now },
      // 7. David (7) → Amazon Cloud (6) → OA stage
      { id: 7, job_id: 6, user_id: 7, status: 'reviewed', notes: null, applied_at: may18, current_stage_id: 7, createdAt: now, updatedAt: now },
      // 8. Laura (8) → Google DE (2) → HR stage
      { id: 8, job_id: 2, user_id: 8, status: 'reviewed', notes: null, applied_at: may12, current_stage_id: 3, createdAt: now, updatedAt: now },
      // 9. Laura (8) → Amazon SDE (5) → Technical stage
      { id: 9, job_id: 5, user_id: 8, status: 'reviewed', notes: null, applied_at: may18, current_stage_id: 8, createdAt: now, updatedAt: now },
      // 10. Daniel (10) → Google DE (2) → Technical stage
      { id: 10, job_id: 2, user_id: 10, status: 'reviewed', notes: null, applied_at: may20, current_stage_id: 2, createdAt: now, updatedAt: now },
      // 11. Daniel (10) → Amazon SDE (5) → HR stage
      { id: 11, job_id: 5, user_id: 10, status: 'reviewed', notes: null, applied_at: may20, current_stage_id: 9, createdAt: now, updatedAt: now },
    ]);

    // ──────────────────────────────────────────────
    // Application Stage Logs
    // ──────────────────────────────────────────────
    await queryInterface.bulkInsert('ApplicationStages', [
      // App 1 (John → Google SWE): OA shortlisted, Tech shortlisted, HR pending
      { id: 1, application_id: 1, stage_id: 1, status: 'shortlisted', notes: 'Scored 92/100', updated_by: 11, createdAt: may12, updatedAt: may12 },
      { id: 2, application_id: 1, stage_id: 2, status: 'shortlisted', notes: 'Strong coding and system design', updated_by: 11, createdAt: may15, updatedAt: may15 },
      { id: 3, application_id: 1, stage_id: 3, status: 'pending', notes: null, updated_by: 11, createdAt: may20, updatedAt: may20 },

      // App 2 (John → MS SDE): OA shortlisted, Tech shortlisted, Final shortlisted (selected!)
      { id: 4, application_id: 2, stage_id: 4, status: 'shortlisted', notes: 'Excellent score', updated_by: 11, createdAt: may10, updatedAt: may10 },
      { id: 5, application_id: 2, stage_id: 5, status: 'shortlisted', notes: 'Great problem-solving approach', updated_by: 11, createdAt: may15, updatedAt: may15 },
      { id: 6, application_id: 2, stage_id: 6, status: 'shortlisted', notes: 'Selected for the role!', updated_by: 11, createdAt: may20, updatedAt: may20 },

      // App 3 (Jane → Google DE): OA shortlisted, Tech eliminated
      { id: 7, application_id: 3, stage_id: 1, status: 'shortlisted', notes: 'Good analytical skills', updated_by: 11, createdAt: may12, updatedAt: may12 },
      { id: 8, application_id: 3, stage_id: 2, status: 'eliminated', notes: 'Insufficient system design knowledge', updated_by: 11, createdAt: may15, updatedAt: may15 },

      // App 4 (Peter → MS SDE): OA shortlisted, Tech pending
      { id: 9, application_id: 4, stage_id: 4, status: 'shortlisted', notes: 'Passed OA', updated_by: 11, createdAt: may12, updatedAt: may12 },
      { id: 10, application_id: 4, stage_id: 5, status: 'pending', notes: null, updated_by: 11, createdAt: may18, updatedAt: may18 },

      // App 5 (Michael → MS PM): OA eliminated
      { id: 11, application_id: 5, stage_id: 4, status: 'eliminated', notes: 'Low score in aptitude section', updated_by: 11, createdAt: may15, updatedAt: may15 },

      // App 6 (Sarah → Amazon SDE): OA shortlisted, Tech pending
      { id: 12, application_id: 6, stage_id: 7, status: 'shortlisted', notes: 'Strong coding skills', updated_by: 11, createdAt: may18, updatedAt: may18 },
      { id: 13, application_id: 6, stage_id: 8, status: 'pending', notes: null, updated_by: 11, createdAt: may20, updatedAt: may20 },

      // App 7 (David → Amazon Cloud): OA pending
      { id: 14, application_id: 7, stage_id: 7, status: 'pending', notes: 'Awaiting assessment', updated_by: 11, createdAt: may18, updatedAt: may18 },

      // App 8 (Laura → Google DE): OA shortlisted, Tech shortlisted, HR pending
      { id: 15, application_id: 8, stage_id: 1, status: 'shortlisted', notes: 'Good performance', updated_by: 11, createdAt: may12, updatedAt: may12 },
      { id: 16, application_id: 8, stage_id: 2, status: 'shortlisted', notes: 'Strong data engineering concepts', updated_by: 11, createdAt: may15, updatedAt: may15 },
      { id: 17, application_id: 8, stage_id: 3, status: 'pending', notes: null, updated_by: 11, createdAt: may18, updatedAt: may18 },

      // App 9 (Laura → Amazon SDE): OA shortlisted, Tech pending
      { id: 18, application_id: 9, stage_id: 7, status: 'shortlisted', notes: 'Passed', updated_by: 11, createdAt: may18, updatedAt: may18 },
      { id: 19, application_id: 9, stage_id: 8, status: 'pending', notes: null, updated_by: 11, createdAt: may20, updatedAt: may20 },

      // App 10 (Daniel → Google DE): OA shortlisted, Tech pending
      { id: 20, application_id: 10, stage_id: 1, status: 'shortlisted', notes: 'Excellent OA score', updated_by: 11, createdAt: may20, updatedAt: may20 },
      { id: 21, application_id: 10, stage_id: 2, status: 'pending', notes: null, updated_by: 11, createdAt: may20, updatedAt: may20 },

      // App 11 (Daniel → Amazon SDE): OA shortlisted, Tech shortlisted, HR pending
      { id: 22, application_id: 11, stage_id: 7, status: 'shortlisted', notes: 'Top percentile', updated_by: 11, createdAt: may20, updatedAt: may20 },
      { id: 23, application_id: 11, stage_id: 8, status: 'shortlisted', notes: 'Strong system design', updated_by: 11, createdAt: may20, updatedAt: may20 },
      { id: 24, application_id: 11, stage_id: 9, status: 'pending', notes: null, updated_by: 11, createdAt: may20, updatedAt: may20 },
    ]);

    await queryInterface.sequelize.query(`SELECT setval('"JobApplications_id_seq"', (SELECT MAX(id) FROM "JobApplications"))`);
    await queryInterface.sequelize.query(`SELECT setval('"ApplicationStages_id_seq"', (SELECT MAX(id) FROM "ApplicationStages"))`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ApplicationStages', { application_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] });
    await queryInterface.bulkDelete('JobApplications', { id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] });
  }
};
