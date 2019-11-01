import React from 'react';
import Loading from 'components/Loading';
import { captureException } from 'utils/errorTracking';
import useSWR from 'swr';

export const withData = (key, getData) => Component => props => {
  const { data: result, error } = useSWR(key, getData, {
    onError: captureException,
  });

  if (!!error) {
    return <div style={{ padding: 15 }}>Error: {error.message}</div>;
  }

  const loading = !result;
  if (loading) {
    return <Loading />;
  }

  return (
    <Component
      {...props}
      data={result.data}
      result={{ ...result }}
      loading={loading}
      error={error}
    />
  );
};
