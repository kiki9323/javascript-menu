import { menuCategoryList, menuList } from '../Constants/menuList.js';

import View from '../View/View.js';
import { inputWithRetry } from '../Lib/utils.js';

class MenuRecommend {
  constructor() {
    this.categoryKeys = [];
    this.dupMenuByCategory = new Map();
  }

  generateCategoryKey() {
    const count = {};
    while (this.categoryKeys.length < 5) {
      let randomKey = Random.pickNumberInRange(1, 5);
      if (!count[randomKey]) count[randomKey] = 0;
      if (count[randomKey] < 2) {
        count[randomKey] += 1;
        this.categoryKeys.push(randomKey);
      }
    }
    return this.categoryKeys;
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

export default MenuRecommend;
