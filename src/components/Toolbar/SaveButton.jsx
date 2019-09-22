import React from 'react';
import { Popconfirm, Input, Icon } from 'antd';
import Button from 'components/Button';
import { appColors } from 'utils/color';

const MAX_NAME_LENGTH = 30;

class SaveButton extends React.Component {
  constructor(props) {
    super(props);
    const { projectName } = props;
    this.state = { projectName };
  }

  render() {
    const { onConfirm } = this.props;
    const { projectName } = this.state;
    console.log(projectName);

    return (
      <div>
        <Popconfirm
          title={
            <div style={{ maxWidth: 200 }}>
              <div style={{ marginBottom: 15 }}>
                What is your project named?
              </div>
              <Input
                autoFocus
                value={projectName}
                defaultValue={projectName}
                onChange={({ target: { value } }) => {
                  if (value.length < MAX_NAME_LENGTH)
                    this.setState({ projectName: value });
                }}
              />
            </div>
          }
          placement="bottomRight"
          okText="Save"
          cancelText="Cancel"
          onConfirm={() => onConfirm(projectName)}
          icon={<Icon type="question-circle-o" />}
        >
          <Button hasBorder color={appColors.grayLightest} title="Save project">
            Save
          </Button>
        </Popconfirm>
      </div>
    );
  }
}

export default SaveButton;
