const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const { testConnection } = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const { restoreActiveNotifications } = require('./controllers/notificationController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

const startServer = async () => {
  await testConnection();
  
  // Restore active notification subscriptions
  await restoreActiveNotifications();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer(); 