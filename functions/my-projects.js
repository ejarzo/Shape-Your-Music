import {
  getFauna,
  getProjectPreviewData,
  withErrorWrapper,
} from './utils/fauna';

exports.handler = withErrorWrapper(async (event, context) => {
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: 'Not logged in' };
  }

  // const { before, after, size = 24 } = event.queryStringParameters;
  const { q, client } = getFauna();
  console.log('USER', user);
  const result = await client.query(
    q.Paginate(
      q.Match(q.Index('projectsByUserId'), user.sub)
      // {
      //   size,
      //   after: after ? [parseInt(after)] : undefined,
      //   before: before ? [parseInt(before)] : undefined,
      // }
    )
  );

  const getAllprojectDataQuery = result.data.map(ref => q.Get(ref));
  const allProjects = await client.query(getAllprojectDataQuery);

  return {
    statusCode: 200,
    body: JSON.stringify({
      after: result.after,
      before: result.before,
      data: allProjects.map(({ ref, data, ts }, i) => {
        return {
          ref,
          ts,
          _id: ref.id,
          index: i,
          ...getProjectPreviewData(data),
        };
      }),
    }),
  };
});
