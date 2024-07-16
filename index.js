const express = require('express')
const app = express()
var cors = require('cors')
var jwt = require('jsonwebtoken');

app.use(express.json())
app.use(cors())

const secretWord = 'secretWord';

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/test', function (req, res) {
    const token = req.header('authorization');
    try {
        var decoded = jwt.verify(token, secretWord);
        console.log(decoded);
        res.json(decoded)
    } catch (err) {
        console.log('TOKEN ERROR')
        res.send('No such user')
    }
})

app.post('/login', (req, res) => {

    let token = req.header('authorization');
    token && (token = token.split(' ')[1]);
    let email;
    let password;
    try {
        var decoded = jwt.verify(token, secretWord);
        email = decoded.email;
        password = decoded.password;
    } catch (err) {
        console.log('No token');
    }

    if (!email) email = req.body.email;
    if (!password) password = req.body.password;

    if (!email || !password) {
        res.json({});
    } else {
        // validate user with {email} and {password}
        let isUserValid = true;
        if (isUserValid) {
            token = jwt.sign({ email, password }, secretWord)
            res.json({ email, password, token });
        } else {
            res.json({});
        }
    }
})

app.listen(3000)