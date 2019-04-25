import React from 'react';
import Button from 'components/Button';
import { captureException } from 'utils/errorTracking';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    captureException(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div style={{ padding: 50 }}>
          <h1>Sorry, something went wrong!</h1>
          <Button hasBorder onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
