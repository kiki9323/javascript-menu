import { Console, Random } from '@woowacourse/mission-utils';
import { menuCategoryList, menuList } from '../Constants/menuList.js';

import Coach from '../Domain/Coach.js';

class MenuController {
  constructor() {
    // this.exceptsMenu = new Map();
    this.coach = new Coach();
  }

  async runMenu() {
    Console.print(`점심 메뉴 추천을 시작합니다.`);

    // 1. 코치 이름 입력
    await this.coach.addCoaches();
    // 2. 코치 이름 배열 개수만큼 루프 돌면서 못 먹는 메뉴 입력 (Map 생성)
    await this.coach.setExceptsMenu();

    Console.print(`\n메뉴 추천 결과입니다.`);
    Console.print(`[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]`);

    // 3. 카테고리 별 음식 추천
    this.recommendWeeklyMenu();

    Console.print(`\n추천을 완료했습니다.`);
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
    return categoryKeys.map((i) => {
      const categoryName = menuCategoryList.get(i);
      const categoryMenuList = menuList.get(categoryName);

      let selectedMenuId;
      let pickMenu;
      do {
        const menuIds = categoryMenuList.map((item) => item.id);
        selectedMenuId = Random.shuffle(menuIds)[0];
        pickMenu = categoryMenuList[selectedMenuId - 1].menu;
      } while (this.isMenuExcluded(pickMenu));

      return pickMenu;
    });
  }

  isMenuExcluded(menu) {
    const excludedMenus = this.coach.getExceptsAllMenu();
    return excludedMenus.includes(menu);
  }

  resultMenu(categoryKeys) {
    this.coach.getCoachesAndMenu().forEach((_, name) => {
      const pickMenu = this.recommendMenuByCategory(categoryKeys);
      let message = '';
      pickMenu.forEach((menu) => {
        message += ' | ' + menu;
      });
      Console.print(`[ ${name}${message} ]`);
    });
  }
}
export default MenuController;
