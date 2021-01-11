import knex from 'knex';
import knexfile from '../../knexfile';

const environment = process.env.ENVIRONMENT || 'development';
export default knex(knexfile[environment]);
