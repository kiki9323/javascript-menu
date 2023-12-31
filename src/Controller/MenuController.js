import { menuCategoryList, menuList } from '../Constants/menuList.js';

import Coach from '../Domain/Coach.js';
import MessageFormat from '../Lib/MessageFormat.js';
import { Random } from '@woowacourse/mission-utils';
import View from '../View/View.js';

class MenuController {
  constructor() {
    this.coach = new Coach();
    this.view = new View();
    this.dupMenuByCategory = new Map();
  }

  async runMenu() {
    this.view.printStartAlert();

    await this.coach.addCoaches();
    await this.coach.setExceptsMenu();

    this.view.printResultAlert();
    this.view.printResultWeekly();

    this.recommendWeeklyMenu();

    this.view.printEndAlert();
  }

  recommendWeeklyMenu() {
    const categoryKeys = this.generateCategoryKey();
    this.view.print(MessageFormat.categoryMessage(categoryKeys));
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

  recommendMenuByCategory(categoryKeys) {
    return categoryKeys.map((i) => {
      const categoryName = menuCategoryList.get(i);
      const categoryMenuList = menuList.get(categoryName);

      this.isDuplicateMenuByCategory(categoryName);

      let selectedMenuId;
      let pickMenu;
      do {
        selectedMenuId = Random.shuffle(categoryMenuList.map((item) => item.id))[0];
        pickMenu = categoryMenuList[selectedMenuId - 1].menu;
      } while (this.isMenuExcluded(pickMenu) || this.getDuplicateMenuByCategory(categoryName));

      this.setDuplicateMenuByCategory(categoryName, pickMenu);

      return pickMenu;
    });
  }

  isDuplicateMenuByCategory(categoryName) {
    if (!this.dupMenuByCategory.has(categoryName)) {
      this.dupMenuByCategory.set(categoryName, []);
    }
  }

  getDuplicateMenuByCategory(categoryName) {
    return this.dupMenuByCategory.get(categoryName).includes(pickMenu);
  }

  setDuplicateMenuByCategory(categoryName, pickMenu) {
    this.dupMenuByCategory.get(categoryName).push(pickMenu);
  }

  isMenuExcluded(menu) {
    const excludedMenus = this.coach.getExceptsAllMenu();
    return excludedMenus.includes(menu);
  }

  resultMenu(categoryKeys) {
    this.coach.getCoachesAndMenu().forEach((_, name) => {
      const pickMenu = this.recommendMenuByCategory(categoryKeys);
      this.view.print(MessageFormat.categoryMessage(pickMenu, name));
    });
  }
}
export default MenuController;
