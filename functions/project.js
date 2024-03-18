import { getFauna, getId, withErrorWrapper } from './utils/fauna';

exports.handler = withErrorWrapper(async (event, context) => {
  const method = event.httpMethod;
  const { q, client } = getFauna();
  const id = getId(event.path);
  const { user } = context.clientContext;
  if (!id) return { statusCode: 400, body: 'invalid request' };

  console.log(`Function 'project' invoked. Method: ${method}, Read id: ${id}`);
  const projectIdPath = `classes/Project/${id}`;

  const verifyProjectOwner = async (id, user) => {
    if (!user) {
      throw new Error('Not logged in');
    }
    const project = await client.query(q.Get(q.Ref(projectIdPath)));
    if (!project) {
      throw new Error('Project not found');
    }
    const { userId } = project.data;
    if (userId !== user.sub) {
      throw new Error('Unauthorized');
    }
  };

  switch (method) {
    case 'GET': {
      const response = await client.query(q.Get(q.Ref(projectIdPath)));
      return { statusCode: 200, body: JSON.stringify(response) };
    }

    case 'POST': {
      if (!user) {
        return { statusCode: 401, body: 'Not logged in' };
      }
      const userId = user.sub;
      const userName = user.user_metadata.full_name;
      const dateCreated = Date.now() * 1000;
      const data = JSON.parse(event.body);
      const response = await client.query(
        q.Create(q.Ref('classes/Project'), {
          data: { ...data, userId, userName, dateCreated },
        })
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: { ...response.data, _id: response.ref.id },
        }),
      };
    }

    case 'PATCH': {
      try {
        await verifyProjectOwner(id, user);
      } catch (err) {
        return { statusCode: 401, body: JSON.stringify(err) };
      }
      const data = JSON.parse(event.body);
      const response = await client.query(
        q.Update(q.Ref(projectIdPath), { data })
      );
      return { statusCode: 200, body: JSON.stringify(response) };
    }

    case 'DELETE': {
      try {
        await verifyProjectOwner(id, user);
      } catch (err) {
        return { statusCode: 401, body: JSON.stringify(err) };
      }
      const response = await client.query(q.Delete(q.Ref(projectIdPath)));
      return { statusCode: 200, body: JSON.stringify(response) };
    }

    default:
      return { statusCode: 400, body: 'invalid method' };
  }
});
