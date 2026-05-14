const { DriveStage } = require('../../models');

const create = async (data) => {
  return await DriveStage.create(data);
};

const findByDrive = async (driveId) => {
  return await DriveStage.findAll({
    where: { driveId },
    order: [['sequenceOrder', 'ASC']]
  });
};

const deleteByDrive = async (driveId) => {
  return await DriveStage.destroy({ where: { driveId } });
};

module.exports = {
  create,
  findByDrive,
  deleteByDrive
};
