const { Drive, DriveStage, JobDescription } = require('../../models');

const findAll = async (statusFilter) => {
  const where = statusFilter ? { status: statusFilter } : {};
  return await Drive.findAll({
    where,
    include: [
      { model: DriveStage, as: 'stages', order: [['sequenceOrder', 'ASC']] },
      { model: JobDescription, as: 'jobDescriptions' }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const findById = async (id) => {
  return await Drive.findByPk(id, {
    include: [
      { model: DriveStage, as: 'stages', order: [['sequenceOrder', 'ASC']] },
      { model: JobDescription, as: 'jobDescriptions' }
    ]
  });
};

const create = async (data) => {
  return await Drive.create(data);
};

const update = async (id, data) => {
  const drive = await Drive.findByPk(id);
  if (!drive) throw new Error('Drive not found');
  return await drive.update(data);
};

const destroy = async (id) => {
  const drive = await Drive.findByPk(id);
  if (!drive) throw new Error('Drive not found');
  return await drive.destroy();
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  destroy
};
