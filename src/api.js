import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33338208-11c51ab24b54d8aa6d7b9aafa';

export default class ImagesApi {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.currentHits = 0;
  }

  async getImages() {
    const options = {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    };
    const response = await axios.get(BASE_URL, options);

    this.increasePage();
    this.increaseCurrentHits();

    return response.data;
  }

  increasePage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  increaseCurrentHits() {
    this.currentHits += 40;
  }

  resetCurrentHits() {
    this.currentHits = 0;
  }
}
