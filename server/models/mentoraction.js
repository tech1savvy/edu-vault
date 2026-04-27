'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MentorAction extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      MentorAction.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
      MentorAction.belongsTo(models.User, { foreignKey: 'mentorId', as: 'mentor' });
    }
  }
  MentorAction.init({
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deadline: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'MentorAction',
  });
  return MentorAction;
};