const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        // instance variable
        this.filename = filename;
        
        try {
            //no async behavior, using accessSync and writFileSync as constructors cant be async and performace impact is negligible
            fs.accessSync(this.filename); 
        } catch(err)  {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll(){
        // Open the file called this.filename
        return JSON.parse(await fs.promises.readFile(this.filename, { 
            encoding: 'utf8' 
        }));
    }

    async create(attrs) {
        const records = await this.getAll();
        
        attrs.id = this.randomId();
        records.push(attrs);
        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.create({ email: 'test@test.com', password: 'password' });

    const users = await repo.getAll();
    console.log(users);

    const user = await repo.getOne('agagagag');
    console.log(user);

}

test();

