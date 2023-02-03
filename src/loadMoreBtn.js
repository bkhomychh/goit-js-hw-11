export default class LoadMoreBtn {
  constructor({ selector }) {
    this.ref = document.querySelector(selector);
  }

  hide() {
    this.ref.classList.add('hidden');
  }

  show() {
    this.ref.classList.remove('hidden');
  }

  disable() {
    this.ref.disabled = true;
    this.ref.textContent = 'Loading ...';
  }

  enable() {
    this.ref.disabled = false;
    this.ref.textContent = 'Load more';
  }
}
