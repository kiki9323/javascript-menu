import { Console } from '@woowacourse/mission-utils';

const InputView = {
  async readLineAsync(message) {
    const input = await Console.readLineAsync(message);
    return input;
  },

  async readCoachName(message) {
    const input = await this.readLineAsync(message);

    // Validator.js
    if (!input.trim()) {
      throw new Error('[Coach] 빈 문자열 혹은 공백만 입력할 수 없습니다.');
    }

    return input.split(',');
  },

  async readExceptMenu(message) {
    const input = await this.readLineAsync(message);

    // Validator.js
    if (!input.trim()) {
      throw new Error('[Except] 빈 문자열 혹은 공백만 입력할 수 없습니다.');
    }

    return input.split(',');
  },
};

export default InputView;
