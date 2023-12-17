import InputView from './InputView.js';
import OutputView from './OutputView.js';

class View {
  #inputView = InputView;
  #outputView = OutputView;

  async readCoachName() {
    return await this.#inputView.readCoachName('\n코치의 이름을 입력해 주세요. (, 로 구분)\n');
  }

  async readExceptMenu(name) {
    return await this.#inputView.readExceptMenu(`\n${name}(이)가 못 먹는 메뉴를 입력해 주세요.\n`);
  }

  print(message) {
    this.#outputView.print(message);
  }

  printError(message) {
    this.#outputView.printError(message);
  }

  printStartAlert() {
    this.#outputView.print(`점심 메뉴 추천을 시작합니다.`);
  }

  printResultAlert() {
    this.#outputView.print(`\n메뉴 추천 결과입니다.`);
  }

  printResultWeekly() {
    this.#outputView.print(`[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]`);
  }

  printEndAlert() {
    this.#outputView.print(`\n추천을 완료했습니다.`);
  }
}

export default View;
