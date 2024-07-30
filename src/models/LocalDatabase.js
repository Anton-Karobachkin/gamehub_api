import { Status } from "../constants/status_codes.js";

class LocalDatabase {
    constructor() {
        this.users = [];
    }

    async saveUser({ email, password }) {
        console.log(email, password)
        let newUser = { email, password }
        this.users.push({ email, password });
        console.log('SAVED USER', this.users)
        return { statusCode: Status.OK, message: 'User was saved into db', user: newUser };
    }

    async findUser({ email }) {
        const user = this.users.find(u => u.email === email);
        return user ? { statusCode: Status.OK, message: 'User was found', user } : { statusCode: Status.Error, message: 'User wasnt found' };
    }
}

export default LocalDatabase;