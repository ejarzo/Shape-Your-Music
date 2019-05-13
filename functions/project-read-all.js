import { getFauna } from './utils';
const { q, client } = getFauna();

exports.handler = (event, context, callback) => {
  console.log('Function `project-read-all` invoked');
  return client
    .query(q.Paginate(q.Match(q.Ref('indexes/all_projects'))))
    .then(response => {
      const projectRefs = response.data;
      console.log('project refs', projectRefs);
      console.log(`${projectRefs.length} projects found`);
      // create new query out of project refs. http://bit.ly/2LG3MLg
      const getAllprojectDataQuery = projectRefs.map(ref => {
        return q.Get(ref);
      });
      // then query the refs
      return client.query(getAllprojectDataQuery).then(ret => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(ret),
        });
      });
    })
    .catch(error => {
      console.log('error', error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error),
      });
    });
};
