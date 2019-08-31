import React from 'react';
import Loading from 'components/Loading';

export const withData = getData => Component =>
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { loading: false, data: [], error: null };
    }

    async componentDidMount() {
      this.setState({ loading: true });
      const data = await getData().catch(e => {
        this.setState({ error: e });
      });
      this.setState({ data, loading: false });
    }

    render() {
      const { loading, data, error } = this.state;

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
          loading={loading}
          error={error}
        />
      );
    }
  };
