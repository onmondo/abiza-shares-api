import "reflect-metadata";
require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { envKeys } from './util/config';
import compression from 'compression';
import DBClient from './util/DBClient';
import costRoutes from './routes';

// database connection to mongodb thru mongoose
const {
    // MONGO_DB_URL, 
    // MONGO_DB_PWD, 
    RATE_LIMIT_WINDOW, 
    REQUEST_LIMIT 
} = envKeys();
// const connectionBaseUrl: string = MONGO_DB_URL
// const connectionPassword: string = MONGO_DB_PWD
// const connectionUrl = connectionBaseUrl.replace("<password>", connectionPassword)

export const app = express()
app.use(express.json());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'Booking-Status-Endpoint', 'Booking-Details-Endpoint'],
        },
    })
);

app.use(cors());
app.use(compression());

const limiter = rateLimit({
	windowMs: RATE_LIMIT_WINDOW, 
	limit: REQUEST_LIMIT, 
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        message: 'Request has been stop.'
    }
})

app.use(limiter);

app.set('view engine', 'pug')
app.set("views", `src/views`)

app.get('/', async (req: Request, res: Response) => {
    return res.json({
        message: 'Up and running...'
    })
});

app.use("/api/v1/cost", costRoutes)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.render('notfound', { title: 'Resource not found', message: '😅 resource not found' })
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    res.status(err.statusCode)
        .json({
            message: err.message
        })
})

const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log(`listening on port ${port}`))
