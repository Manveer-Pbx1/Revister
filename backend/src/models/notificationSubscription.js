const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const NotificationSubscription = sequelize.define('NotificationSubscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['daily', 'twice-weekly', 'weekly', 'monthly']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastSent: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notification_subscriptions',
  timestamps: true
});

module.exports = NotificationSubscription;
