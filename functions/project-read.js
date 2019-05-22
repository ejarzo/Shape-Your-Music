import { getFauna, getId } from './utils';
const { q, client } = getFauna();

exports.handler = (event, context, callback) => {
  const id = getId(event.path);
  console.log(event);
  console.log(`Function 'project-read' invoked. Read id: ${id}`);
  return client
    .query(q.Get(q.Ref(`classes/projects/${id}`)))
    .then(response => {
      console.log('success', response);
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
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
