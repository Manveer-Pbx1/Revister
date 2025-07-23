const { sequelize } = require('./db');
const NotificationSubscription = require('../models/notificationSubscription');

const migrate = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating database tables:', error);
    process.exit(1);
  }
};

migrate(); 