type Elements = {
  slideContainer: Element;
  status: Element;
  prevButton: Element;
  nextButton: Element;
};

export type Slide = {
  title: string,
  caption: string;
};

export type InitialState = {
  slides: Slide[];
  activeIndex: number;
};

function slideshow (rootElement: Element, initialState: InitialState) {
  let elements: Elements;
  let slides: Slide[];
  let activeSlideIndex: number;
  let activeSlideElement: Element;

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

    deactivateElement(<Element>activeSlideElement);
    activeSlideElement = <Element>elements.slideContainer.childNodes[activeSlideIndex];
    activateElement(<Element>activeSlideElement);
    elements.status.innerHTML = `${activeSlideIndex + 1} av ${size}: ${activeSlide.caption}`;
  }

  function handleKeydown (evt: KeyboardEvent) {
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

function createSlideElement (data: Slide) {
  const slideElement = document.createElement('li');

  slideElement.setAttribute('role', 'img');
  slideElement.className = 'slideshow__slide';
  slideElement.innerHTML = `${data.title}`;
  slideElement.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;

  return slideElement;
}

function activateElement (el: Element) {
  setTimeout(() => {
    el.classList.add('is-active');
  }, 200);
}

function deactivateElement (el: Element) {
  el.classList.remove('is-active');
}

// Export
export default slideshow;
