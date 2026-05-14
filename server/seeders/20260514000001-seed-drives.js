'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ──────────────────────────────────────────────
    // 1. Drives
    // ──────────────────────────────────────────────
    await queryInterface.bulkInsert('Drives', [
      {
        id: 1,
        company_name: 'Google',
        title: 'Summer 2026 Internship Drive',
        description: 'Hiring top engineering talent for summer internships across multiple teams including Search, Cloud, and AI.',
        status: 'active',
        start_date: '2026-06-01',
        end_date: '2026-07-15',
        created_by: 11,
        location: 'Bangalore',
        drive_type: 'on-campus',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        company_name: 'Microsoft',
        title: 'Campus Drive 2026',
        description: 'Microsoft is hiring full-time employees and interns for software development and product roles.',
        status: 'active',
        start_date: '2026-06-15',
        end_date: '2026-08-01',
        created_by: 11,
        location: 'Hyderabad',
        drive_type: 'on-campus',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        company_name: 'Amazon',
        title: 'SDE Hiring 2026',
        description: 'Amazon is looking for passionate software engineers to build the next generation of e-commerce and cloud solutions.',
        status: 'upcoming',
        start_date: '2026-08-01',
        end_date: '2026-09-15',
        created_by: 11,
        location: 'Remote',
        drive_type: 'off-campus',
        createdAt: now,
        updatedAt: now
      }
    ]);

    // ──────────────────────────────────────────────
    // 2. Drive Stages
    // ──────────────────────────────────────────────
    await queryInterface.bulkInsert('DriveStages', [
      // Google stages (drive 1) — OA → Technical → HR
      { id: 1, drive_id: 1, name: 'Online Assessment', stage_type: 'OA', sequence_order: 1, scheduled_date: '2026-06-10', description: 'Coding assessment on HackerRank', createdAt: now, updatedAt: now },
      { id: 2, drive_id: 1, name: 'Technical Interview', stage_type: 'Technical', sequence_order: 2, scheduled_date: '2026-06-20', description: '1-hour technical coding and system design round', createdAt: now, updatedAt: now },
      { id: 3, drive_id: 1, name: 'HR Interview', stage_type: 'HR', sequence_order: 3, scheduled_date: '2026-06-28', description: 'Behavioral and cultural fit round', createdAt: now, updatedAt: now },

      // Microsoft stages (drive 2) — OA → Technical → Final
      { id: 4, drive_id: 2, name: 'Online Assessment', stage_type: 'OA', sequence_order: 1, scheduled_date: '2026-06-20', description: 'MCQ + coding on Codility', createdAt: now, updatedAt: now },
      { id: 5, drive_id: 2, name: 'Technical Interview', stage_type: 'Technical', sequence_order: 2, scheduled_date: '2026-07-01', description: '45-min technical + problem solving', createdAt: now, updatedAt: now },
      { id: 6, drive_id: 2, name: 'Final Round', stage_type: 'Final', sequence_order: 3, scheduled_date: '2026-07-10', description: 'Managerial + cross-team interview', createdAt: now, updatedAt: now },

      // Amazon stages (drive 3) — OA → Technical → HR → Final
      { id: 7, drive_id: 3, name: 'Online Assessment', stage_type: 'OA', sequence_order: 1, scheduled_date: '2026-08-10', description: '3-hour coding assessment on AMCAT', createdAt: now, updatedAt: now },
      { id: 8, drive_id: 3, name: 'Technical Interview', stage_type: 'Technical', sequence_order: 2, scheduled_date: '2026-08-25', description: '2-hour deep dive into DS & Algo', createdAt: now, updatedAt: now },
      { id: 9, drive_id: 3, name: 'HR Interview', stage_type: 'HR', sequence_order: 3, scheduled_date: '2026-09-05', description: 'Leadership principles and behavioral', createdAt: now, updatedAt: now },
      { id: 10, drive_id: 3, name: 'Final Round', stage_type: 'Final', sequence_order: 4, scheduled_date: '2026-09-12', description: 'Panel interview with senior engineers', createdAt: now, updatedAt: now },
    ]);

    // ──────────────────────────────────────────────
    // 3. Job Descriptions (all linked to drives)
    // ──────────────────────────────────────────────
    await queryInterface.bulkInsert('JobDescriptions', [
      // Google — Software Engineer (drive 1)
      {
        id: 1, drive_id: 1, title: 'Software Engineer Intern',
        description: 'Design, develop, and test software systems for Google Search, Cloud, and AI teams. Collaborate with cross-functional teams to deliver impactful products.',
        requirements: 'Proficiency in Python, JavaScript, and SQL. Understanding of data structures and algorithms. Strong problem-solving skills.',
        status: 'active', category: 'Engineering',
        min_cgpa: 7.0, required_skills: JSON.stringify(['Python', 'JavaScript', 'SQL']),
        eligible_branches: JSON.stringify(['Computer Science']),
        eligibility_notes: 'Open to Computer Science students with CGPA 7.0+ and Python/JS/SQL skills.',
        createdAt: now, updatedAt: now
      },
      // Google — Data Engineer (drive 1)
      {
        id: 2, drive_id: 1, title: 'Data Engineer Intern',
        description: 'Build and maintain data pipelines, optimize ETL processes, and work with large-scale datasets to power ML models and business insights.',
        requirements: 'Strong Python and SQL skills. Familiarity with ETL pipelines and data warehousing concepts.',
        status: 'active', category: 'Data',
        min_cgpa: 7.5, required_skills: JSON.stringify(['Python', 'SQL']),
        eligible_branches: JSON.stringify(['Computer Science', 'Information Technology']),
        eligibility_notes: 'CS or IT students with CGPA 7.5+ and Python+SQL proficiency.',
        createdAt: now, updatedAt: now
      },
      // Microsoft — SDE Intern (drive 2)
      {
        id: 3, drive_id: 2, title: 'Software Development Intern',
        description: 'Work on real-world Microsoft products, contribute to codebases used by millions, and learn from industry mentors.',
        requirements: 'Coding experience in Python. Basic understanding of OOP and REST APIs. Eagerness to learn.',
        status: 'active', category: 'Engineering',
        min_cgpa: 6.5, required_skills: JSON.stringify(['Python']),
        eligible_branches: JSON.stringify([]),
        eligibility_notes: 'Open to all branches with CGPA 6.5+ and Python skills.',
        createdAt: now, updatedAt: now
      },
      // Microsoft — PM Intern (drive 2)
      {
        id: 4, drive_id: 2, title: 'Product Manager Intern',
        description: 'Define product vision, gather requirements, and work with engineering and design teams to ship features that delight users.',
        requirements: 'SQL and Python skills. Strong communication and analytical thinking.',
        status: 'active', category: 'Product',
        min_cgpa: 7.0, required_skills: JSON.stringify(['SQL', 'Python']),
        eligible_branches: JSON.stringify(['Computer Science', 'Business Administration']),
        eligibility_notes: 'CS or Business students with CGPA 7.0+ and SQL+Python skills.',
        createdAt: now, updatedAt: now
      },
      // Amazon — SDE (drive 3)
      {
        id: 5, drive_id: 3, title: 'Software Development Engineer',
        description: 'Design and build scalable distributed systems for Amazon e-commerce and AWS. Own features end-to-end from design to deployment.',
        requirements: 'Strong Python and SQL. Experience with algorithms, data structures, and system design.',
        status: 'active', category: 'Engineering',
        min_cgpa: 7.5, required_skills: JSON.stringify(['Python', 'SQL']),
        eligible_branches: JSON.stringify(['Computer Science', 'Computer Engineering']),
        eligibility_notes: 'CS or Computer Engineering with CGPA 7.5+ and Python+SQL skills.',
        createdAt: now, updatedAt: now
      },
      // Amazon — Cloud Engineer (drive 3)
      {
        id: 6, drive_id: 3, title: 'Cloud Engineer',
        description: 'Design and manage cloud infrastructure on AWS. Automate deployments, optimize costs, and ensure high availability.',
        requirements: 'Python and Linux experience. Knowledge of cloud services and infrastructure-as-code.',
        status: 'active', category: 'Infrastructure',
        min_cgpa: 7.0, required_skills: JSON.stringify(['Python', 'Linux']),
        eligible_branches: JSON.stringify(['Computer Science', 'Information Technology', 'Computer Engineering']),
        eligibility_notes: 'CS/IT/Computer Engineering with CGPA 7.0+ and Python+Linux skills.',
        createdAt: now, updatedAt: now
      }
    ]);

    // Update sequences after explicit ID inserts
    await queryInterface.sequelize.query(`SELECT setval('"Drives_id_seq"', (SELECT MAX(id) FROM "Drives"))`);
    await queryInterface.sequelize.query(`SELECT setval('"DriveStages_id_seq"', (SELECT MAX(id) FROM "DriveStages"))`);
    await queryInterface.sequelize.query(`SELECT setval('"JobDescriptions_id_seq"', (SELECT MAX(id) FROM "JobDescriptions"))`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('JobDescriptions', { id: [1, 2, 3, 4, 5, 6] });
    await queryInterface.bulkDelete('DriveStages', { id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
    await queryInterface.bulkDelete('Drives', { id: [1, 2, 3] });
  }
};
