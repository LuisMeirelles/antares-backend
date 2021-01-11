import path from 'path';

const {
    CLEARDB_DATABASE_URL,
    DATABASE_USER,
    DATABASE_PASSWORD
} = process.env;

export default {
    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'mywordismypassword',
            database: 'antares'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory:  path.join(path.dirname('./'), 'src', 'database', 'migrations')
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host: CLEARDB_DATABASE_URL,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: 'antares'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory:  path.join(path.dirname('./'), 'build', 'src', 'database', 'migrations')
        }
    }
};
