const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    ),
  });
}
const db = admin.firestore();

exports.handler = async (event, context) => {
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: 'Not logged in' };
  }

  const { pageSize = 24, startAfter } = event.queryStringParameters;

  // Create base query for user's projects ordered by date
  let query = db
    .collection('projects')
    .where('userId', '==', user.sub)
    .orderBy('dateCreated', 'desc');

  // If startAfter cursor provided, start after that document
  if (startAfter) {
    const lastDoc = await db
      .collection('projects')
      .doc(startAfter)
      .get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  // Get one more document than requested to determine if there are more results
  const snapshot = await query.limit(parseInt(pageSize) + 1).get();

  function formatProjectObject(project) {
    return {
      ...project,
      shapesList: project.shapesList.map(shape => ({
        ...shape,
        points: shape.points.value,
      })),
      knobVals: project.knobVals.map(knob => knob.value),
    };
  }

  // Format the documents
  let projects = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      _id: doc.id,
      _ts: data.createdAt.toMillis() * 1000,
      ...formatProjectObject(data),
      createdAt: undefined,
      faunaId: undefined,
    };
  });

  // Remove the extra document we fetched to check for more results
  const isLastPage = projects.length < pageSize;
  const hasMore = !isLastPage;
  if (hasMore) {
    projects = projects.slice(0, pageSize);
  }

  // Get the last document ID for next page cursor
  const lastVisible = projects[projects.length - 1];

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: projects,
      hasMore,
      nextCursor: hasMore ? lastVisible._id : null,
    }),
  };
};
