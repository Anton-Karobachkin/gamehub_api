class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    async saveUserTo(db) {
        const email = this.email;
        const password = this.password;
        return await db.saveUser({ email, password });
    }

    async findUserIn(db) {
        const email = this.email;
        const password = this.password;
        return await db.findUser({ email, password });
    }
}

export default User;