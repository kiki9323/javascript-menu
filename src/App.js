import MenuController from './Controller/MenuController.js';

class App {
  #menuController;

  constructor() {
    this.#menuController = new MenuController();
  }

  async play() {
    await this.#menuController.runMenu();
  }
}

export default App;
