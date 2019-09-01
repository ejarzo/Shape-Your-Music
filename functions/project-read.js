import { getFauna, getId, withErrorWrapper } from './utils';
const { q, client } = getFauna();

exports.handler = withErrorWrapper(async (event, context) => {
  const id = getId(event.path);
  console.log(`Function 'project-read' invoked. Read id: ${id}`);
  const response = await client.query(q.Get(q.Ref(`classes/projects/${id}`)));
  console.log('GOT RESPONSE', response);
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
});
