import React from 'react';
import Loading from 'components/Loading';

export const withData = getData => Component =>
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { loading: false, result: undefined, error: null };
    }

    async componentDidMount() {
      this.setState({ loading: true });
      const result = await getData().catch(e => {
        this.setState({ error: e });
      });
      this.setState({ result, loading: false });
    }

    render() {
      const { loading, result: { data, ...rest } = {}, error } = this.state;

      if (!!error) {
        return <div style={{ padding: 15 }}>Error: {error.message}</div>;
      }

      if (loading) {
        return <Loading />;
      }

      return (
        <Component
          {...this.props}
          data={data}
          result={{ ...rest }}
          loading={loading}
          error={error}
        />
      );
    }
  };
