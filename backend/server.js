const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('@dotenvx/dotenvx');
const connectToDb = require('./config/db');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const reportRoutes = require('./routes/report');
const adminRoutes = require('./routes/admin');

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

//Database connection
connectToDb();

//Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/answers', answerRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});