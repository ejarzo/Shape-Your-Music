import { getFauna } from './utils';
const { q, client } = getFauna();

exports.handler = (event, context, callback) => {
  console.log('Function `project-create` invoked');

  const { user } = context.clientContext;
  if (!user) {
    return callback(null, {
      statusCode: 403,
    });
  }

  const { body } = event;
  const data = JSON.parse(body);
  const userId = user.sub;

  const projectItem = {
    data: {
      ...data,
      userId,
      userName: user.user_metadata.full_name,
    },
  };

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
