const { sequelize } = require('./db');

const dropItemsTable = async () => {
  try {
    // Drop the Items table if it exists
    await sequelize.query('DROP TABLE IF EXISTS "Items"');
    console.log('Items table dropped successfully (if it existed).');
    
    // Sync remaining tables (notifications only)
    const NotificationSubscription = require('../models/notificationSubscription');
    await sequelize.sync({ alter: true });
    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

dropItemsTable();
