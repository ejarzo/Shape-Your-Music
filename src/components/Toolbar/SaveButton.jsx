import React, { useState } from 'react';
import { Popconfirm, Input, Icon } from 'antd';
import Button from 'components/Button';
import { appColors } from 'utils/color';

const MAX_NAME_LENGTH = 30;

function SaveButton(props) {
  const { projectName, onConfirm } = props;
  const [newProjectName, setProjectName] = useState(
    projectName || 'My Project'
  );

  const handleSubmit = e => {
    newProjectName ? onConfirm(newProjectName) : alert('Please enter a name');
  };

  return (
    <div>
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
        placement="bottomRight"
        okText="Save"
        cancelText="Cancel"
        onConfirm={handleSubmit}
        icon={<Icon type="question-circle-o" />}
      >
        <Button hasBorder color={appColors.grayLightest} title="Save project">
          Save
        </Button>
      </Popconfirm>
    </div>
  );
}

export default SaveButton;
