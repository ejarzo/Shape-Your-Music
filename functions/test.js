exports.handler = (event, context, callback) => {
  // "event" has informatiom about the path, body, headers etc of the request
  console.log('event', event);
  // "context" has information about the lambda environment and user details
  console.log('context', context);
  // The "callback" ends the execution of the function and returns a reponse back to the caller
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: '⊂◉‿◉つ',
    }),
  });
};
