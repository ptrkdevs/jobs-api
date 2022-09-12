require('dotenv').config()
require('express-async-errors')

const express = require('express')
const morgan = require('morgan')


// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const app = express();
app.use(morgan('dev'))
// db
const connectDB = require('./db/connect')


app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, //15 mins
  max: 100, //limit each IP to 100 request per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// extra packages
const authenticationMiddleware = require('./middleware/authentication')


// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const notFoundMiddleware = require('./middleware/not-found');
// error handler
const errorHandlerMiddleware = require('./middleware/error-handler');
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware,jobsRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
