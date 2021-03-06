/* generated by Buddy */
if ('undefined' === typeof self) var self = this;
if ('undefined' === typeof global) var global = self;
if ('undefined' === typeof process) var process = {env:{}};
if (self._m_ == null) self._m_ = {};
if (self.require == null) {
  self.require = function require (id) {
    if (_m_[id]) return (_m_[id].boot) ? _m_[id]() : _m_[id];

    if (process.env.NODE_ENV == 'development') {
      console.warn('module ' + id + ' not found');
    }
  };
}
_m_['js/slideshow.js']=(function(module,exports){
  module=this;exports=module.exports;

  function slideshow (rootElement, initialState = {}) {
    let elements;
    let slides;
    let activeSlideIndex;
    let activeSlideElement;
  
    function prev () {
      activeSlideIndex = activeSlideIndex === 0 ? slides.length - 1 : activeSlideIndex - 1;
      update();
    }
  
    function next () {
      activeSlideIndex = (activeSlideIndex + 1) % slides.length;
      update();
    }
  
    function update () {
      const activeSlide = slides[activeSlideIndex];
      const size = slides.length;
  
      if (!size) {
        elements.status.innerHTML = '';
        return;
      }
  
      deactivateElement(activeSlideElement);
      activeSlideElement = elements.slideContainer.childNodes[activeSlideIndex];
      activateElement(activeSlideElement);
      elements.status.innerHTML = `${activeSlideIndex + 1} av ${size}: ${activeSlide.caption}`;
    }
  
    function handleKeydown (evt) {
      switch (evt.key) {
        case 'ArrowLeft': evt.preventDefault(); return prev();
        case 'ArrowRight': evt.preventDefault(); return next();
        case ' ': evt.preventDefault(); return evt.shiftKey ? prev() : next();
        default: return null;
      }
    }
  
    function mount () {
      slides = initialState.slides || [];
      activeSlideIndex = initialState.activeIndex || 0;
      activeSlideElement = null;
      elements = {
        slideContainer: rootElement.querySelector('.slideshow__slideContainer'),
        status: rootElement.querySelector('.slideshow__status'),
        prevButton: rootElement.querySelector('.slideshow__prevButton'),
        nextButton: rootElement.querySelector('.slideshow__nextButton')
      };
  
      // Create and append each slide element to the container element
      slides.forEach((slide, idx) => {
        const slideElement = createSlideElement(slide);
  
        if (idx === activeSlideIndex) {
          activateElement(slideElement);
          activeSlideElement = slideElement;
        }
  
        elements.slideContainer.appendChild(slideElement);
      });
  
      // Add event listeners
      elements.prevButton.addEventListener('click', prev);
      elements.nextButton.addEventListener('click', next);
      elements.slideContainer.addEventListener('click', next);
      window.addEventListener('keydown', handleKeydown);
  
      update();
    }
  
    function unmount () {
      // Remove event listeners
      elements.prevButton.removeEventListener('click', prev);
      elements.nextButton.removeEventListener('click', next);
      elements.slideContainer.removeEventListener('click', next);
      window.removeEventListener('keydown', handleKeydown);
  
      // Remove created slide elements
      while (elements.slideContainer.firstChild) {
        elements.slideContainer.removeChild(elements.slideContainer.firstChild);
      }
  
      // Remove status element content
      elements.status.innerHTML = '';
  
      // Garbage collection
      slides = null;
      activeSlideElement = null;
      activeSlideIndex = null;
      elements = null;
    }
  
    return {mount, unmount};
  }
  
  function createSlideElement (data) {
    const slideElement = document.createElement('li');
  
    slideElement.setAttribute('role', 'img');
    slideElement.className = 'slideshow__slide';
    slideElement.innerHTML = `${data.title}`;
    slideElement.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
  
    return slideElement;
  }
  
  function activateElement (el) {
    setTimeout(() => {
      el.classList.add('is-active');
    }, 200);
  }
  
  function deactivateElement (el) {
    el.classList.remove('is-active');
  }
  
  // Export
  module.exports = slideshow;
  

  return module.exports;
}).call({exports:{}});
_m_['js/bootstrap.js']=(function(module,exports){
  module=this;exports=module.exports;

  const slideshow = _m_['js/slideshow.js'];
  
  const slideshowElement = document.querySelector('#slideshow');
  const initialState = JSON.parse(document.querySelector('#initialState').innerHTML);
  
  // Mount slideshow
  slideshow(slideshowElement, initialState)
    .mount();
  

  return module.exports;
}).call({exports:{}});