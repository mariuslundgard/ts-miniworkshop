import slideshow from './slideshow';

const slideshowElement = document.querySelector('#slideshow');
const initialState = JSON.parse(document.querySelector('#initialState').innerHTML);

// Mount slideshow
slideshow(slideshowElement, initialState)
  .mount();
