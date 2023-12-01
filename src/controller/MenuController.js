import { Console, Random } from '@woowacourse/mission-utils';
import { menuCategoryList, menuList } from '../constants/menuList.js';

class MenuController {
  constructor() {
    this.exceptsMenu = new Map();
  }

  async runMenu() {
    Console.print(`점심 메뉴 추천을 시작합니다.`);

    // 1. 코치 이름 입력
    const inputCoaches = await this.inputCoaches();

    // // 2. 코치 이름 배열 개수만큼 루프 돌면서 못 먹는 메뉴 입력 (Map 생성)
    await this.inputExceptsMenu(inputCoaches);

    Console.print(`\n메뉴 추천 결과입니다.`);
    Console.print(`[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]`);

    // 3. 카테고리 별 음식 추천
    this.recommendWeeklyMenu();

    Console.print(`\n추천을 완료했습니다.`);
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

  recommendWeeklyMenu() {
    const categoryKeys = this.generateCategoryKey();
    this.resultCategory(categoryKeys);
    this.resultMenu(categoryKeys);
  }

  generateCategoryKey() {
    const categoryKeys = [];
    const count = {};

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

  resultCategory(categoryKeys) {
    let message = '';
    categoryKeys.forEach((i) => {
      message += ' | ' + menuCategoryList.get(i);
    });

    Console.print(`[ 카테고리${message} ]`);
  }

  recommendMenuByCategory(categoryKeys) {
    const pickMenu = categoryKeys
      .map((i) => {
        const categoryName = menuCategoryList.get(i);
        const categoryMenuList = menuList.get(categoryName);

        let selectedMenuId;
        let pickMenu;
        do {
          const menuIds = categoryMenuList.map((item) => item.id);
          selectedMenuId = Random.shuffle(menuIds)[0];
          pickMenu = categoryMenuList.filter((list) => list.id === selectedMenuId).map((item) => item.menu);
        } while (this.exceptsMenu.has(pickMenu.join()));

        return pickMenu.join();
      })
      .join(' | ');

    return pickMenu;
  }

  resultMenu(categoryKeys) {
    this.exceptsMenu.forEach((_, name) => {
      const pickMenu = this.recommendMenuByCategory(categoryKeys);
      Console.print(`[ ${name} | ${pickMenu} ]`);
    });
  }
}
export default MenuController;
