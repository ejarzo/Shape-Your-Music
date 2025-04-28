const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    ),
  });
}
const db = admin.firestore();

const convertPayloadToFirestore = payload => {
  return {
    ...payload,
    shapesList: payload.shapesList.map(shape => ({
      ...shape,
      points: { value: shape.points },
    })),
    knobVals: payload.knobVals.map(valArray => ({
      value: valArray,
    })),
  };
};

function convertFirestoreDocToPayload(doc) {
  console.log('doc', doc);
  const data = doc.data();
  return {
    _id: doc.id,
    _ts: data.createdAt.toMillis() * 1000, // Convert to microseconds to match Fauna
    ...data,
    shapesList: data.shapesList.map(shape => ({
      ...shape,
      points: shape.points.value,
    })),
    knobVals: data.knobVals.map(knob => knob.value),
    // ...formatProjectObject(data),
    // Remove Firestore-specific fields
    createdAt: undefined,
    faunaId: undefined,
  };
  // return {
  //   ...project,
  //   _id: project.id,
  //   _ref: project.id,
  //   ref: project.id,
  //   shapesList: project.shapesList.map(shape => ({
  //     ...shape,
  //     points: shape.points.value,
  //   })),
  //   knobVals: project.knobVals.map(knob => knob.value),
  // };
}

const getId = urlPath => urlPath.match(/([^\/]*)\/*$/)[0];

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  const id = getId(event.path);
  const { user } = context.clientContext;
  if (!id) return { statusCode: 400, body: 'invalid request' };
  console.log(`Function 'project' invoked. Method: ${method}, Read id: ${id}`);
  const projectRef = db.collection('projects').doc(id);

  const verifyProjectOwner = async (id, user) => {
    if (!user) {
      throw new Error('Not logged in');
    }
    const project = await projectRef.get();
    if (!project.exists) {
      throw new Error('Project not found');
    }
    const { userId } = project.data();
    if (userId !== user.sub) {
      throw new Error('Unauthorized');
    }
  };

  switch (method) {
    case 'GET': {
      const doc = await projectRef.get();
      if (!doc.exists) {
        return { statusCode: 404, body: 'Project not found' };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: convertFirestoreDocToPayload(doc),
        }),
      };
    }
    case 'POST': {
      if (!user) {
        return { statusCode: 401, body: 'Not logged in' };
      }
      const userId = user.sub;
      const userName = user.user_metadata.full_name;
      const now = new Date();
      const dateCreatedTs = now.getTime() * 1000;
      const data = JSON.parse(event.body);

      const docRef = await db.collection('projects').add({
        ...convertPayloadToFirestore(data),
        userId,
        userName,
        createdAt: now,
        dateCreated: dateCreatedTs,
      });

      const newDoc = await docRef.get();
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: convertFirestoreDocToPayload(newDoc),
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
      await projectRef.update(convertPayloadToFirestore(data));

      const updatedDoc = await projectRef.get();
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: convertFirestoreDocToPayload(updatedDoc),
        }),
      };
    }
    case 'DELETE': {
      try {
        await verifyProjectOwner(id, user);
      } catch (err) {
        return { statusCode: 401, body: JSON.stringify(err) };
      }
      await projectRef.delete();
      return {
        statusCode: 200,
        body: JSON.stringify({ id }),
      };
    }
    default:
      return { statusCode: 400, body: 'invalid method' };
  }
};
