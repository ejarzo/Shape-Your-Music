import { getFauna, getId } from './utils';
const { q, client } = getFauna();

exports.handler = async (event, context) => {
  try {
    const id = getId(event.path);
    console.log(`Function 'project-read' invoked. Read id: ${id}`);
    const response = await client.query(q.Get(q.Ref(`classes/projects/${id}`)));
    console.log(response);
    /* TODO: 400 error on client query */
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
