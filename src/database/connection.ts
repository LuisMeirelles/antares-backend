import knex from 'knex';
import knexfile from '../../knexfile';

const environment = process.env.ENVIRONMENT || 'development';

export default knex(environment === 'development' ? knexfile.development : knexfile.production);
