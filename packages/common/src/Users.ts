import fs from 'fs';
import { hashSync, compareSync } from 'bcryptjs';

export class Users
{
    static #ensureDir()
    {
        if(!fs.existsSync('users'))
            fs.mkdirSync('users');
    }

    static #usernameToFilename(username: string): string
    {
        return Buffer.from(username.toLowerCase()).toString('base64');
    }

    static set(username: string, password: string)
    {
        Users.#ensureDir();
        fs.writeFileSync(`users/${Users.#usernameToFilename(username)}`, hashSync(password));
    }

    static validate(username: string, password: string): boolean
    {
        const filepath = `users/${Users.#usernameToFilename(username)}`;
        if(!fs.existsSync(filepath))
            return false;
        else
        {
            const hash = fs.readFileSync(filepath).toString();
            return compareSync(password, hash);
        }
    }

}

export default Users;
