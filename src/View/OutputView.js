import { Console } from '@woowacourse/mission-utils';

const OutputView = {
  print(message) {
    Console.print(message);
  },

  printError(error) {
    this.print(error.message);
  },
};

export default OutputView;
