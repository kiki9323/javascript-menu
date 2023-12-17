import View from '../View/View.js';
import { inputWithRetry } from '../Lib/utils.js';

class Coach {
  #view;
  #exceptMenu;
  #names;

  constructor() {
    this.#view = new View();
    this.#exceptMenu = new Map();
    this.#names;
  }

  async addCoaches() {
    this.#names = await inputWithRetry(() => this.#view.readCoachName());
  }

  async setExceptsMenu() {
    for (const name of this.#names) {
      const inputMenu = await inputWithRetry(() => this.#view.readExceptMenu(name));
      this.#exceptMenu.set(name, inputMenu);
    }
  }

  getExceptsAllMenu() {
    return Array.from(this.#exceptMenu.values()).flat();
  }

  getCoachesAndMenu() {
    return this.#exceptMenu;
  }
}

export default Coach;
