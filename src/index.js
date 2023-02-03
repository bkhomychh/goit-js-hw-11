import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import ImagesApi from './api';
import LoadMoreBtn from './loadMoreBtn';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};
const imagesApi = new ImagesApi();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
});

let lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSerchFormSubmit);
loadMoreBtn.ref.addEventListener('click', updateUi);

async function onSerchFormSubmit(evt) {
  evt.preventDefault();

  clearGallery();
  loadMoreBtn.hide();
  imagesApi.resetPage();
  imagesApi.resetCurrentHits();
  imagesApi.searchQuery = evt.target.elements.searchQuery.value.trim();

  if (!imagesApi.searchQuery) {
    Notify.warning('Please enter a search term');
    return;
  }

  const totalHits = await updateUi();
  evt.target.reset();

  if (totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function createCardMarkups(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card" >
							<a href="${largeImageURL}">
								<img src="${webformatURL}" alt="${tags}" loading="lazy" />
							</a>
							<div class="info">
								<p class="info-item">
									<b>Likes</b>
									<span>${likes}</span>
								</p>
								<p class="info-item">
									<b>Views</b>
									<span>${views}</span>
								</p>
								<p class="info-item">
									<b>Comments</b>
									<span>${comments}</span>
								</p>
								<p class="info-item">
									<b>Downloads</b>
									<span>${downloads}</span>
								</p>
							</div>
						</div>`
    )
    .join('');
}

function insertMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function updateUi() {
  const galleryCoordinates = refs.gallery.getBoundingClientRect();
  let totalHits = 0;

  loadMoreBtn.disable();

  try {
    const data = await imagesApi.getImages();
    const images = data.hits;

    if (!images.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    totalHits = data.totalHits;

    const markup = createCardMarkups(images);

    insertMarkup(markup);
    loadMoreBtn.show();
    loadMoreBtn.enable();

    window.scrollBy({
      top: galleryCoordinates.bottom,
      behavior: 'smooth',
    });

    if (imagesApi.currentHits >= totalHits) {
      loadMoreBtn.hide();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch ({ message }) {
    console.log(message);
  }

  lightbox.refresh();

  return totalHits;
}
