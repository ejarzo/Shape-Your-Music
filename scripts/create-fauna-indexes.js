const faunadb = require('faunadb');
const chalk = require('chalk');
const q = faunadb.query;

console.log(chalk.cyan('Creating indexes...'));

createFaunaIndexes(process.env.FAUNADB_SERVER_SECRET).then(() => {
  console.log(chalk.green('Indexes created'));
});

/* Create indexes
  - projects_sort_by_ts_desc
*/
function createFaunaIndexes(key) {
  const client = new faunadb.Client({ secret: key });
  return client
    .query(
      q.CreateIndex({
        name: 'projects_sort_by_ts_desc',
        source: q.Ref('classes/projects'),
        values: [{ field: ['ts'], reverse: true }, { field: ['ref'] }],
      })
    )
    .catch(e => {
      if (e.message === 'instance already exists') {
        console.log(chalk.green('Index already exists'));
      } else {
        console.log(chalk.red('Error'));
        console.log(chalk.red(e.message));
        console.log(e);
        throw e;
      }
    });
}
