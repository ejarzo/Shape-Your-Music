import * as Sentry from '@sentry/browser';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    // beforeSend(event, hint) {
    //   // Check if it is an exception, and if so, show the report dialog
    //   if (event.exception) {
    //     Sentry.showReportDialog({ eventId: event.event_id });
    //   }
    //   return event;
    // },
  });
};

export const captureException = (error, info) => {
  Sentry.captureException(error, info);
};
