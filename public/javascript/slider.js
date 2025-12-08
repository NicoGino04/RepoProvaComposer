class Slider {
    constructor(element, options = {}) {
        this.slider = element;
        this.track = element.querySelector('.slider__track');
        this.slides = element.querySelectorAll('.slider__slide');
        this.dots = element.querySelectorAll('.slider__dot');
        this.prevBtn = element.querySelector('.slider__arrow--prev');
        this.nextBtn = element.querySelector('.slider__arrow--next');

        // Options
        this.options = {
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            threshold: 50,
            ...options
        };

        // State
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.autoplayTimer = null;
        this.isPaused = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSlider();

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    bindEvents() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        this.track.addEventListener('touchend', (e) => this.handleDragEnd(e));

        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.track.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.track.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        this.track.addEventListener('mouseleave', (e) => this.handleDragEnd(e));

        // Arrow buttons
        this.prevBtn ?.addEventListener('click', () => this.prev());
        this.nextBtn ?.addEventListener('click', () => this.next());

        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.slider.addEventListener('mouseenter', () => this.pause());
            this.slider.addEventListener('mouseleave', () => this.resume());
        }

        // Keyboard navigation
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Make slider focusable
        this.slider.setAttribute('tabindex', '0');
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.startX = this.getPositionX(e);
        this.track.classList.add('dragging');
        this.slider.classList.add('interacted');
        this.pause();
    }

    handleDragMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();
        this.currentX = this.getPositionX(e);
        const diff = this.currentX - this.startX;
        const offset = -this.currentIndex * 100 + (diff / this.slider.offsetWidth) * 100;

        this.track.style.transform = `translateX(${offset}%)`;
    }

    handleDragEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.classList.remove('dragging');

        const diff = this.currentX - this.startX;

        if (Math.abs(diff) > this.options.threshold) {
            if (diff > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.updateSlider();
        }

        if (this.options.autoplay && !this.isPaused) {
            this.startAutoplay();
        }
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    prev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slideCount - 1;
        this.updateSlider();
        this.resetAutoplay();
    }

    next() {
        this.currentIndex = this.currentIndex < this.slideCount - 1 ? this.currentIndex + 1 : 0;
        this.updateSlider();
        this.resetAutoplay();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateSlider();
        this.resetAutoplay();
        this.slider.classList.add('interacted');
    }

    updateSlider() {
        // Move track
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update slides active state
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    resetAutoplay() {
        if (this.options.autoplay && !this.isPaused) {
            this.startAutoplay();
        }
    }

    pause() {
        this.isPaused = true;
        this.stopAutoplay();
        this.slider.classList.add('paused');
    }

    resume() {
        this.isPaused = false;
        this.slider.classList.remove('paused');
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) {
        new Slider(sliderElement, {
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            threshold: 50
        });
    }
});