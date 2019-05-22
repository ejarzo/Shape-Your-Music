import React from 'react';
import { withRouter } from 'react-router';
import { ModalRoute as ReactRouterModalRoute } from 'react-router-modal';
import './modal-styles.css';
import styles from './styles.module.css';

class ModalRoute extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const { component: ChildComponent, path } = this.props;
    return (
      <ReactRouterModalRoute
        parentPath="/"
        path={path}
        component={({ closeModal }) => (
          <div>
            <button className={styles.closeButton} onClick={closeModal}>
              <i className="ion-close-round" />
            </button>
            <ChildComponent />
          </div>
        )}
      />
    );
  }
}

export default withRouter(ModalRoute);
