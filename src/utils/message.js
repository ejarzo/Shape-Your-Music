import { message } from 'antd';

/* Global style for message component */
message.config({ top: 90 });
const MESSAGE_KEY = 'LOADING_MESSAGE';

export const showLoadingMessage = content => {
  message.loading({
    content,
    key: MESSAGE_KEY,
  });
};

export const showErrorMessage = error => {
  message.error({
    content: `Sorry, an error occurred: ${error}`,
    key: MESSAGE_KEY,
  });
};

export const showSuccessMessage = content => {
  message.success({
    content,
    key: MESSAGE_KEY,
  });
};
