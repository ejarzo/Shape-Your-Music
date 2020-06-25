import * as Sentry from '@sentry/node';
import { AuthenticationError, ApolloError } from 'apollo-server-lambda';
const { FUNCTIONS_SENTRY_DSN } = process.env;

export const initSentry = () => {
  Sentry.init({
    dsn: FUNCTIONS_SENTRY_DSN,
    release: process.env.COMMIT_REF,
  });
};

export const objectMap = (object, mapper) =>
  Object.entries(object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: mapper(value, key),
    }),
    {}
  );

export const resolversWrapper = resolvers =>
  objectMap(resolvers, (resolver, name) => async (...args) => {
    try {
      const result = await resolver(...args);
      return result;
    } catch (err) {
      console.error('ERROR: ', err, args);
      const [variables, context] = args.slice(1);
      Sentry.withScope(scope => {
        scope.setExtra('resolver', name);
        scope.setExtra('variables', variables);
        scope.setExtra('context', context);
        Sentry.captureException(err);
      });
      await Sentry.flush(2000);
      if (err instanceof AuthenticationError || err instanceof ApolloError) {
        // TODO disable these if there are too many
        throw err;
      } else {
        throw new Error('INTERNAL_SERVER_ERROR');
      }
    }
  });
