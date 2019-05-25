import { getFauna, getId } from './utils';
const { q, client } = getFauna();

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const id = getId(event.path);
  const { user } = context.clientContext;
  console.log(`Function 'project-update' invoked. update id: ${id}`);

  if (!user) {
    return {
      statusCode: 403,
    };
  }

  const project = await client.query(q.Get(q.Ref(`classes/projects/${id}`)));
  const { userId } = project.data;

  if (userId !== user.id) {
    return {
      statusCode: 403,
    };
  }

  try {
    const response = await client.query(
      q.Update(q.Ref(`classes/projects/${id}`), { data })
    );

    console.log('success', response);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
