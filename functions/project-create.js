import { getFauna } from './utils';
const { q, client } = getFauna();

exports.handler = (event, context, callback) => {
  const { body } = event;
  const data = JSON.parse(body);
  console.log('Function `project-create` invoked', data);

  const projectItem = { data };
  return client
    .query(q.Create(q.Ref('classes/projects'), projectItem))
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
