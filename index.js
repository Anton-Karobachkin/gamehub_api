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
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)

    var token = jwt.sign({ email, password }, secretWord, { expiresIn: '1h' });
    res.json({ token })
})

app.listen(3000)