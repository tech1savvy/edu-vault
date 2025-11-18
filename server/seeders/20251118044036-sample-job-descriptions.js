'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('JobDescriptions', [
      {
        title: 'Senior Software Engineer at Google',
        description: 'Design, develop, test, deploy, maintain and improve software. Manage individual project priorities, deadlines and deliverables. Embody a culture of innovation and collaboration.',
        requirements: 'BS degree in Computer Science, similar technical field of study or equivalent practical experience. 5 years of professional software development experience. Experience with one or more general purpose programming languages including but not limited to: Java, C/C++, Python, or Go.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Data Scientist, Machine Learning at Netflix',
        description: 'We are looking for a Data Scientist to join our team and help us build the next generation of personalized recommendations. You will work on a variety of projects, including building and deploying machine learning models, conducting A/B tests, and analyzing user behavior.',
        requirements: 'PhD or MS in a quantitative field (e.g., Statistics, Computer Science, a natural science). 3+ years of experience in a data science role. Experience with Python and SQL. Experience with machine learning frameworks such as TensorFlow or PyTorch.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'DevOps Engineer at Amazon Web Services',
        description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will be responsible for designing, implementing, and managing our CI/CD pipelines, as well as our monitoring and alerting systems.',
        requirements: 'BS in Computer Science or a related field. 3+ years of experience in a DevOps role. Experience with AWS, Docker, and Kubernetes. Experience with a scripting language such as Python or Bash.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'UX/UI Designer at Apple',
        description: 'We are looking for a UX/UI Designer to join our team and help us create beautiful and intuitive user experiences. You will be responsible for the entire design process, from user research to prototyping and visual design.',
        requirements: '5+ years of experience in a UX/UI design role. A strong portfolio of work. Experience with Figma, Sketch, and Adobe Creative Suite. Excellent communication and collaboration skills.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Product Manager, AI at Microsoft',
        description: 'We are looking for a Product Manager to join our team and help us build the next generation of AI-powered products. You will be responsible for the entire product lifecycle, from ideation to launch and beyond.',
        requirements: 'BS in Computer Science or a related field. 5+ years of experience in a product management role. Experience with AI and machine learning. Excellent communication and collaboration skills.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('JobDescriptions', null, {});
  }
};
