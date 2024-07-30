import { Status } from "../constants/status_codes.js";
import pkg from 'pg';
import bcrypt from 'bcrypt';
const { Client } = pkg;

class Postgresql {
    constructor(user, host, database, password, port) {
        this.client = new Client({
            user,
            host,
            database,
            password,
            port,
        });

        this.client.connect()
            .then(() => console.log('Connected to PostgreSQL'))
            .catch(err => console.error('Connection error', err.stack));
    }

    async saveUser({ email, password }) {
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await this.client.query(`insert into public.user (email, password) values ($1, $2)`, [email, hashedPassword]);
        return { statusCode: Status.OK, message: 'User was saved into db', user: { email, password } };
    }

    async findUser({ email, password }) {
        console.log('E', email, password)
        const user = await this.client.query(`select * from public.user where public.user.email = '${email}'`);
        console.log('U', user.rows)
        return (user.rows[0] && await bcrypt.compare(password, user.rows[0].password)) ? { statusCode: Status.OK, message: 'User was found', user: { email: user.rows[0].email, password } } : { statusCode: Status.Error, message: 'User wasnt found' };
    }
}

export default Postgresql;