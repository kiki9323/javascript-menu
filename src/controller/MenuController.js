import { Console, Random } from '@woowacourse/mission-utils';

import menuList from '../constants/menuList.js';

class MenuController {
  constructor() {
    this.exceptsMenu = new Map();
  }

  async runMenu() {
    Console.print(`점심 메뉴 추천을 시작합니다.`);

    // 1. 코치 이름 입력
    const inputCoaches = await this.inputCoaches();

    // 2. 코치 이름 배열 개수만큼 루프 돌면서 못 먹는 메뉴 입력 (Map 생성)
    await this.inputExceptsMenu(inputCoaches);

    Console.print(`\n메뉴 추천 결과입니다.`);
    Console.print(`[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]`);

    // 3. 카테고리 별 음식 추천
    this.recommendMenu(this.exceptsMenu);
  }

  async inputCoaches() {
    const inputCoaches = await Console.readLineAsync('\n코치의 이름을 입력해 주세요. (, 로 구분)\n');
    return inputCoaches.split(',');
  }

  async inputExceptsMenu(inputCoaches) {
    for (const coach of inputCoaches) {
      const inputMenu = await Console.readLineAsync(`\n${coach}(이)가 못 먹는 메뉴를 입력해 주세요.\n`);
      this.exceptsMenu.set(coach, inputMenu.split(','));
    }
  }

  generateCategoryKeys() {
    // 3.1 카테고리를 정한다. (랜덤 숫자 중복 2개까지 허용하여 5개 생성 => menuList의 키로 사용)
    const categoryKeys = [];
    let count = {};

    while (categoryKeys.length < 5) {
      let randomKey = Random.pickNumberInRange(1, 5);
      if (!count[randomKey]) count[randomKey] = 0;
      if (count[randomKey] < 2) {
        count[randomKey] += 1;
        categoryKeys.push(randomKey);
      }
    }
    return categoryKeys;
  }

  // 3. 카테고리 별 음식 메뉴 추천
  recommendMenu(exceptsMenu) {
    // 3.1 카테고리를 정한다. (랜덤 숫자 중복 2개까지 허용하여 5개 생성 => menuList의 키로 사용)
    const categoryKeys = this.generateCategoryKeys(); // categoryKeys [ 1, 2, 3, 4, 3 ]

    // 3.2 키값에 따라서 menuList에서 카테고리 정하고, 해당 카테고리에서 메뉴 추천
    // 3.2.1 키값에 따라서 menuList에서 카테고리 정한다.
    let categoriesMessage = '';
    categoryKeys.forEach((key) => {
      const category = menuList.get(key).category;
      categoriesMessage += ' | ' + category;
    });

    Console.print(`[ 카테고리${categoriesMessage} ]`);

    // 3.2.2 해당 카테고리에서 메뉴 추천
    for (const [coach, except] of exceptsMenu) {
      // 못 먹는 메뉴들을 미리 걸러냄
      const filteredMenu = categoryKeys.map((key) => {
        const menu = menuList.get(key).menu;
        const filtered = menu.filter((food) => !except.includes(food));
        return filtered;
      });

      // 걸러낸 메뉴들의 인덱스로 배열을 만들고,
      const numbersMenu = filteredMenu.map((v) => v.map((_, i) => i));
      // 해당 배열들을 섞어서 셔플하여
      const menuIndexByCategories = numbersMenu.map((n) => Random.shuffle(n)[0]);
      // 메뉴 출력
      let resultMenu = '';
      menuIndexByCategories.forEach((menuIndex, index) => {
        resultMenu += ' | ' + filteredMenu[index][menuIndex];
      });

      Console.print(`[ ${coach}${resultMenu} ]`);
    }
    Console.print(`\n추천을 완료했습니다.`);
  }
}
export default MenuController;
