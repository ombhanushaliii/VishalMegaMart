const cron = require('node-cron');
const { autoCloseInactiveThreads } = require('../controllers/liveThread');

// Run every 10 minutes to check for inactive threads
const startThreadCleanupJob = () => {
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('Running thread cleanup job...');
      const closedCount = await autoCloseInactiveThreads();
      if (closedCount > 0) {
        console.log(`Auto-closed ${closedCount} inactive threads`);
      }
    } catch (error) {
      console.error('Error in thread cleanup job:', error);
    }
  });
};

module.exports = { startThreadCleanupJob };
