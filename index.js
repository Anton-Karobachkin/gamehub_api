import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Status } from './src/constants/status_codes.js';
import { SECRET_WORD } from './src/constants/status_codes.js';
import User from './src/models/User.js';
import LocalDatabase from './src/models/LocalDatabase.js';
import Postgresql from './src/models/Postgresql.js';
import 'dotenv/config';

const db = new Postgresql(process.env.USER, process.env.HOST, process.env.DATABASE, process.env.PASSWORD, process.env.PORT);// new LocalDatabase();

const app = express()
app.use(express.json())
app.use(cors())

const _verifyTokenForUser = (token) => {
    return jwt.verify(token, SECRET_WORD);
}

const _generateTokenForUser = (email, password) => {
    return jwt.sign({ email, password }, SECRET_WORD);
}

app.get('/verifyUser', async (req, res) => {
    let token = req.header('authorization');
    token && (token = token.split(' ')[1]);
    let email;
    let password;
    try {
        var decoded = _verifyTokenForUser(token);
        email = decoded.email;
        password = decoded.password;

        const user = new User(email, password);
        const findUserResp = await user.findUserIn(db);
        console.log(findUserResp)
        if (findUserResp.statusCode === Status.OK) {
            //const token = _generateTokenForUser(findUserResp.user.email, findUserResp.user.password);
            res.json({ statusCode: Status.OK, message: 'User found', token });
        } else {
            res.json({ statusCode: Status.Error, message: 'User wasnt found' });
        }
    } catch (err) {
        res.json({ statusCode: Status.Error, message: 'Invalid user' });
    }
});

app.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.json({ statusCode: Status.Error, message: 'Empty email or password' });
    } else {
        const user = new User(email, password);
        const findUserResp = await user.findUserIn(db);
        console.log(findUserResp)
        if (findUserResp.statusCode === Status.OK) {
            const token = _generateTokenForUser(findUserResp.user.email, findUserResp.user.password);
            res.json({ statusCode: Status.OK, message: 'User found', token });
        } else {
            res.json({ statusCode: Status.Error, message: 'User wasnt found' });
        }
    }
});

app.post('/registrate', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.json({ statusCode: Status.Error, message: 'Empty email or password' });
    } else {
        const user = new User(email, password);
        const savedUserResp = await user.saveUserTo(db);
        console.log(savedUserResp)
        if (savedUserResp.statusCode === Status.OK) {
            const token = _generateTokenForUser(savedUserResp.user.email, savedUserResp.user.password);
            res.json({ statusCode: Status.OK, message: 'User found', token });
        } else {
            res.json({ statusCode: Status.Error, message: 'User wasnt found' });
        }
    }
});

app.listen(3000)