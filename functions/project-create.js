import { getFauna } from './utils';
const { q, client } = getFauna();

exports.handler = async (event, context) => {
  console.log('Function `project-create` invoked');

  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
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

    const response = await client.query(
      q.Create(q.Ref('classes/projects'), projectItem)
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log('error', err);
    return {
      statusCode: 400,
      body: JSON.stringify(err),
    };
  }
};
