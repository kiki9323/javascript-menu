import { menuCategoryList } from '../Constants/menuList.js';

const MessageFormat = {
  categoryMessage: (keys, name = '카테고리') => {
    let message = '';

    keys.forEach((key) => {
      let value = typeof key === 'number' ? menuCategoryList.get(key) : key;
      message += ' | ' + value;
    });
    return `[ ${name}${message} ]`;
  },
};

export default MessageFormat;
