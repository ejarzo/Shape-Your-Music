import React, { useState } from 'react';
import { Popconfirm, Input, Icon } from 'antd';
import IdentityModal from 'components/IdentityModal';
import { useIdentityContext } from 'react-netlify-identity';

const MAX_NAME_LENGTH = 30;

function SaveButton(props) {
  const { projectName, onConfirm } = props;
  const { isLoggedIn } = useIdentityContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setProjectName] = useState(
    projectName || 'My Project'
  );

  const executeSave = () => {
    if (newProjectName) {
      onConfirm(newProjectName);
    } else {
      alert('Please enter a name');
    }
  };

  const handleSubmit = e => {
    if (isLoggedIn) {
      executeSave();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <IdentityModal
        showDialog={isModalOpen}
        onCloseDialog={() => setIsModalOpen(false)}
        onLogin={executeSave}
      />

      <Popconfirm
        title={
          <div style={{ maxWidth: 200 }}>
            <div style={{ marginBottom: 15 }}>
              {projectName
                ? `Overwrite "${projectName}"?`
                : 'What is your project named?'}
            </div>
            {!projectName && (
              <Input
                autoFocus
                value={newProjectName}
                onPressEnter={handleSubmit}
                onChange={({ target: { value } }) => {
                  if (value.length < MAX_NAME_LENGTH) setProjectName(value);
                }}
              />
            )}
          </div>
        }
        placement="rightTop"
        okText="Save"
        cancelText="Cancel"
        onConfirm={handleSubmit}
        icon={<Icon type="question-circle-o" />}
      >
        <Icon type="save" />
      </Popconfirm>
    </>
  );
}

export default SaveButton;
