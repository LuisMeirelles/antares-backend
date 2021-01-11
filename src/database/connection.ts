import knex from 'knex';
import knexfile from '../../knexfile';

const environment = process.env.ENVIRONMENT || 'development';

if (environment === 'production') {
    export default knex(knexfile.production);
} else {
    export default knex(knexfile.development);
}
