'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `Test Student ${i}`,
        email: `student${i}@example.com`,
        password: hashedPassword,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    users.push({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'administrator',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const insertedUsers = await queryInterface.bulkInsert('Users', users, { returning: ['id', 'email', 'role'] });

    const studentIds = insertedUsers.filter(u => u.role === 'student').map(u => u.id);

    const jobProfiles = [
      {
        name: 'John Doe',
        role: 'Software Engineer',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: 'New York, USA',
        link: 'linkedin.com/in/johndoe',
        experience: {
          type: 'Full-time',
          company: 'Google',
          role: 'Software Engineer',
          duration: '2020-Present',
          details: 'Developed and maintained various software.',
        },
        education: {
          institution: 'University of XYZ',
          degree: 'Master of Science',
          fieldOfStudy: 'Computer Science',
          duration: '2018-2020',
          details: 'Specialized in AI and Machine Learning.',
        },
        project: {
          title: 'EduVault',
          description: 'A platform for managing educational records.',
          techStack: 'Node.js, Express, PostgreSQL, React',
          timeline: '2023-Present',
          type: 'Web Application',
          collaborators: 'Jane Doe',
        },
        skill: { name: 'JavaScript', level: 'Expert' },
        achievement: {
          title: 'Award for Innovation',
          description: 'Received an award for innovative project design.',
          date: '2022',
        },
        certification: {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: '2021',
          credentialId: 'ABC123XYZ',
        }
      },
      {
        name: 'Jane Smith',
        role: 'Data Scientist',
        email: 'jane.smith@example.com',
        phone: '098-765-4321',
        location: 'San Francisco, USA',
        link: 'linkedin.com/in/janesmith',
        experience: {
          type: 'Full-time',
          company: 'Facebook',
          role: 'Data Scientist',
          duration: '2019-Present',
          details: 'Analyzed large datasets to extract meaningful insights.',
        },
        education: {
          institution: 'Stanford University',
          degree: 'PhD',
          fieldOfStudy: 'Statistics',
          duration: '2015-2019',
          details: 'Focused on predictive modeling.',
        },
        project: {
          title: 'Sentiment Analysis Tool',
          description: 'A tool to analyze sentiment from social media data.',
          techStack: 'Python, Pandas, Scikit-learn',
          timeline: '2022',
          type: 'Machine Learning Model',
          collaborators: 'John Doe',
        },
        skill: { name: 'Python', level: 'Expert' },
        achievement: {
          title: 'Best Paper Award',
          description: 'Won best paper award at a top data science conference.',
          date: '2021',
        },
        certification: {
          name: 'TensorFlow Developer Certificate',
          issuer: 'Google',
          date: '2020',
          credentialId: 'DEF456ABC',
        }
      },
      {
        name: 'Peter Jones',
        role: 'DevOps Engineer',
        email: 'peter.jones@example.com',
        phone: '111-222-3333',
        location: 'Austin, USA',
        link: 'linkedin.com/in/peterjones',
        experience: {
          type: 'Full-time',
          company: 'Amazon',
          role: 'DevOps Engineer',
          duration: '2021-Present',
          details: 'Managed CI/CD pipelines and cloud infrastructure.',
        },
        education: {
          institution: 'Texas A&M University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Information Technology',
          duration: '2017-2021',
          details: 'Focused on systems administration.',
        },
        project: {
          title: 'Automated Deployment System',
          description: 'A system to automate application deployments.',
          techStack: 'Jenkins, Docker, Kubernetes',
          timeline: '2022',
          type: 'Infrastructure as Code',
          collaborators: 'Emily White',
        },
        skill: { name: 'Docker', level: 'Expert' },
        achievement: {
          title: 'Certified Kubernetes Administrator (CKA)',
          description: 'Achieved CKA certification.',
          date: '2022',
        },
        certification: {
          name: 'AWS Certified DevOps Engineer - Professional',
          issuer: 'Amazon Web Services',
          date: '2023',
          credentialId: 'GHI789DEF',
        }
      },
      {
        name: 'Emily White',
        role: 'UI/UX Designer',
        email: 'emily.white@example.com',
        phone: '444-555-6666',
        location: 'Seattle, USA',
        link: 'linkedin.com/in/emilywhite',
        experience: {
          type: 'Freelance',
          company: 'Self-employed',
          role: 'UI/UX Designer',
          duration: '2019-Present',
          details: 'Designed user interfaces for web and mobile applications.',
        },
        education: {
          institution: 'Rhode Island School of Design',
          degree: 'Bachelor of Fine Arts',
          fieldOfStudy: 'Graphic Design',
          duration: '2015-2019',
          details: 'Specialized in user-centered design.',
        },
        project: {
          title: 'E-commerce App Redesign',
          description: 'Redesigned the user interface of a popular e-commerce app.',
          techStack: 'Figma, Sketch, Adobe XD',
          timeline: '2023',
          type: 'Mobile App Design',
          collaborators: 'Peter Jones',
        },
        skill: { name: 'Figma', level: 'Expert' },
        achievement: {
          title: 'Webby Award',
          description: 'Won a Webby Award for best user interface design.',
          date: '2022',
        },
        certification: {
          name: 'Certified User Experience (UX) Professional',
          issuer: 'Nielsen Norman Group',
          date: '2021',
          credentialId: 'JKL012GHI',
        }
      },
      {
        name: 'Michael Brown',
        role: 'Product Manager',
        email: 'michael.brown@example.com',
        phone: '777-888-9999',
        location: 'Boston, USA',
        link: 'linkedin.com/in/michaelbrown',
        experience: {
          type: 'Full-time',
          company: 'Microsoft',
          role: 'Product Manager',
          duration: '2018-Present',
          details: 'Led the development of new software products.',
        },
        education: {
          institution: 'Harvard Business School',
          degree: 'MBA',
          fieldOfStudy: 'Business Administration',
          duration: '2016-2018',
          details: 'Focused on product strategy.',
        },
        project: {
          title: 'New Feature Launch',
          description: 'Launched a new feature for a major software product.',
          techStack: 'Jira, Confluence',
          timeline: '2022',
          type: 'Product Launch',
          collaborators: 'Sarah Green',
        },
        skill: { name: 'Agile Methodologies', level: 'Expert' },
        achievement: {
          title: 'Product of the Year Award',
          description: 'Won product of the year award for a new software product.',
          date: '2021',
        },
        certification: {
          name: 'Certified Scrum Product Owner (CSPO)',
          issuer: 'Scrum Alliance',
          date: '2020',
          credentialId: 'MNO345JKL',
        }
      },
      {
        name: 'Sarah Green',
        role: 'Cybersecurity Analyst',
        email: 'sarah.green@example.com',
        phone: '123-123-1234',
        location: 'Washington D.C., USA',
        link: 'linkedin.com/in/sarahgreen',
        experience: {
          type: 'Full-time',
          company: 'Northrop Grumman',
          role: 'Cybersecurity Analyst',
          duration: '2020-Present',
          details: 'Monitored networks for security breaches.',
        },
        education: {
          institution: 'Carnegie Mellon University',
          degree: 'Master of Science',
          fieldOfStudy: 'Information Security',
          duration: '2018-2020',
          details: 'Specialized in ethical hacking.',
        },
        project: {
          title: 'Intrusion Detection System',
          description: 'Developed a custom intrusion detection system.',
          techStack: 'Snort, Wireshark, Python',
          timeline: '2022',
          type: 'Security Tool',
          collaborators: 'Michael Brown',
        },
        skill: { name: 'Penetration Testing', level: 'Expert' },
        achievement: {
          title: 'Certified Information Systems Security Professional (CISSP)',
          description: 'Achieved CISSP certification.',
          date: '2021',
        },
        certification: {
          name: 'Certified Ethical Hacker (CEH)',
          issuer: 'EC-Council',
          date: '2020',
          credentialId: 'PQR678MNO',
        }
      },
      {
        name: 'David Black',
        role: 'Cloud Engineer',
        email: 'david.black@example.com',
        phone: '456-456-4567',
        location: 'Chicago, USA',
        link: 'linkedin.com/in/davidblack',
        experience: {
          type: 'Full-time',
          company: 'Oracle',
          role: 'Cloud Engineer',
          duration: '2019-Present',
          details: 'Designed and managed cloud infrastructure.',
        },
        education: {
          institution: 'University of Illinois Urbana-Champaign',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Engineering',
          duration: '2015-2019',
          details: 'Focused on cloud computing.',
        },
        project: {
          title: 'Cloud Migration',
          description: 'Migrated on-premise infrastructure to the cloud.',
          techStack: 'AWS, Terraform, Ansible',
          timeline: '2022',
          type: 'Infrastructure Project',
          collaborators: 'Laura Blue',
        },
        skill: { name: 'AWS', level: 'Expert' },
        achievement: {
          title: 'AWS Certified Solutions Architect - Professional',
          description: 'Achieved AWS Certified Solutions Architect - Professional certification.',
          date: '2021',
        },
        certification: {
          name: 'Google Certified Professional Cloud Architect',
          issuer: 'Google',
          date: '2022',
          credentialId: 'STU901PQR',
        }
      },
      {
        name: 'Laura Blue',
        role: 'Database Administrator',
        email: 'laura.blue@example.com',
        phone: '789-789-7890',
        location: 'Miami, USA',
        link: 'linkedin.com/in/laurablue',
        experience: {
          type: 'Full-time',
          company: 'IBM',
          role: 'Database Administrator',
          duration: '2017-Present',
          details: 'Managed and maintained large-scale databases.',
        },
        education: {
          institution: 'University of Florida',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          duration: '2013-2017',
          details: 'Specialized in database systems.',
        },
        project: {
          title: 'Database Optimization',
          description: 'Optimized database performance for a high-traffic application.',
          techStack: 'PostgreSQL, MySQL, Oracle',
          timeline: '2023',
          type: 'Database Project',
          collaborators: 'David Black',
        },
        skill: { name: 'SQL', level: 'Expert' },
        achievement: {
          title: 'Oracle Certified Professional, MySQL 5.7 Database Administrator',
          description: 'Achieved Oracle certification for MySQL.',
          date: '2020',
        },
        certification: {
          name: 'Microsoft Certified: Azure Database Administrator Associate',
          issuer: 'Microsoft',
          date: '2021',
          credentialId: 'VWX234STU',
        }
      },
      {
        name: 'Chris Yellow',
        role: 'Network Engineer',
        email: 'chris.yellow@example.com',
        phone: '112-223-3344',
        location: 'Dallas, USA',
        link: 'linkedin.com/in/chrisyellow',
        experience: {
          type: 'Full-time',
          company: 'Cisco',
          role: 'Network Engineer',
          duration: '2018-Present',
          details: 'Designed and implemented computer networks.',
        },
        education: {
          institution: 'Purdue University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Network Engineering Technology',
          duration: '2014-2018',
          details: 'Focused on network design and security.',
        },
        project: {
          title: 'Office Network Overhaul',
          description: 'Overhauled the network infrastructure for a large office.',
          techStack: 'Cisco, Juniper, Wireshark',
          timeline: '2022',
          type: 'Network Project',
          collaborators: 'Daniel Red',
        },
        skill: { name: 'Cisco IOS', level: 'Expert' },
        achievement: {
          title: 'Cisco Certified Network Professional (CCNP)',
          description: 'Achieved CCNP certification.',
          date: '2020',
        },
        certification: {
          name: 'CompTIA Network+',
          issuer: 'CompTIA',
          date: '2019',
          credentialId: 'YZA567VWX',
        }
      },
      {
        name: 'Daniel Red',
        role: 'AI/ML Engineer',
        email: 'daniel.red@example.com',
        phone: '556-667-7788',
        location: 'Raleigh, USA',
        link: 'linkedin.com/in/danielred',
        experience: {
          type: 'Full-time',
          company: 'NVIDIA',
          role: 'AI/ML Engineer',
          duration: '2021-Present',
          details: 'Developed and deployed machine learning models.',
        },
        education: {
          institution: 'Georgia Institute of Technology',
          degree: 'Master of Science',
          fieldOfStudy: 'Computer Science',
          duration: '2019-2021',
          details: 'Specialized in Machine Learning.',
        },
        project: {
          title: 'Image Recognition System',
          description: 'Built an image recognition system for autonomous vehicles.',
          techStack: 'Python, TensorFlow, PyTorch, OpenCV',
          timeline: '2023',
          type: 'Machine Learning Project',
          collaborators: 'Chris Yellow',
        },
        skill: { name: 'TensorFlow', level: 'Expert' },
        achievement: {
          title: 'Kaggle Competition Winner',
          description: 'Won a Kaggle competition for a predictive modeling task.',
          date: '2022',
        },
        certification: {
          name: 'Deep Learning Specialization',
          issuer: 'Coursera',
          date: '2021',
          credentialId: 'BCD890YZA',
        }
      }
    ];

    const headings = [];
    const experiences = [];
    const educations = [];
    const projects = [];
    const skills = [];
    const achievements = [];
    const certifications = [];

    for (let i = 0; i < studentIds.length; i++) {
      const userId = studentIds[i];
      const profile = jobProfiles[i];

      headings.push({
        user_id: userId,
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        link: profile.link,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      experiences.push({
        user_id: userId,
        ...profile.experience,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      educations.push({
        user_id: userId,
        ...profile.education,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      projects.push({
        user_id: userId,
        ...profile.project,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      skills.push({
        user_id: userId,
        ...profile.skill,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      achievements.push({
        user_id: userId,
        ...profile.achievement,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      certifications.push({
        user_id: userId,
        ...profile.certification,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Headings', headings, {});
    await queryInterface.bulkInsert('Experiences', experiences, {});
    await queryInterface.bulkInsert('Educations', educations, {});
    await queryInterface.bulkInsert('Projects', projects, {});
    await queryInterface.bulkInsert('Skills', skills, {});
    await queryInterface.bulkInsert('Achievements', achievements, {});
    await queryInterface.bulkInsert('Certifications', certifications, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Headings', null, {});
    await queryInterface.bulkDelete('Experiences', null, {});
    await queryInterface.bulkDelete('Educations', null, {});
    await queryInterface.bulkDelete('Projects', null, {});
    await queryInterface.bulkDelete('Skills', null, {});
    await queryInterface.bulkDelete('Achievements', null, {});
    await queryInterface.bulkDelete('Certifications', null, {});
  }
};
