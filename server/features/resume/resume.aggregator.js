

import db from '../../models';

const {
  Heading,
  Achievement,
  Certification,
  Education,
  Experience,
  Project,
  Skill,
} = db;

const getSectionText = (title, items, formatter) => {
  if (!items || items.length === 0) {
    return '';
  }
  const header = `### ${title}\n`;
  const body = items.map(formatter).join('\n');
  return `${header}${body}\n\n`;
};

const formatters = {
  heading: (item) => `${item.name} - ${item.role}\n${item.email} | ${item.phone} | ${item.location}\nLink: ${item.link}`,
  achievements: (item) => `- ${item.title}: ${item.description} (${item.date})`,
  certifications: (item) => `- ${item.name} from ${item.issuer} (${item.date})`,
  educations: (item) => `- ${item.degree} in ${item.fieldofstudy} from ${item.institution} (${item.duration}). ${item.details}`,
  experiences: (item) => `- ${item.role} at ${item.company} (${item.duration}). ${item.details}`,
  projects: (item) => `- ${item.title} (${item.type}): ${item.description}. Tech: ${item.techstack}`,
  skills: (item) => `- ${item.name} (${item.level})`,
};

export const getAggregatedResumeText = async (userId) => {
  let fullText = '';

  const heading = await Heading.findOne({ where: { userId } });
  if (heading) {
    fullText += getSectionText('Profile', [heading], formatters.heading);
  }

  const experiences = await Experience.findAll({ where: { userId } });
  fullText += getSectionText('Experience', experiences, formatters.experiences);

  const educations = await Education.findAll({ where: { userId } });
  fullText += getSectionText('Education', educations, formatters.educations);
  
  const projects = await Project.findAll({ where: { userId } });
  fullText += getSectionText('Projects', projects, formatters.projects);

  const skills = await Skill.findAll({ where: { userId } });
  fullText += getSectionText('Skills', skills, formatters.skills);

  const certifications = await Certification.findAll({ where: { userId } });
  fullText += getSectionText('Certifications', certifications, formatters.certifications);

  const achievements = await Achievement.findAll({ where: { userId } });
  fullText += getSectionText('Achievements', achievements, formatters.achievements);

  return fullText.trim();
};
