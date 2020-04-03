// titles
import data from '../data/titles.json';

// styles
import '../css/reset.css';
import '../css/index.css';

// analytics
import analytics from './modules/_analytics';

(() => {
  const app = {
    init() {
      this.isLocal = location.href.includes('localhost') || location.href.includes('127.0.0.1');

      !this.isLocal && analytics.init();

      window.goToTitle = this.goToTitle;

      this.cacheDOM();
    },

    cacheDOM() {
      this.lastIndex = null;

      this.titleContainer = document.querySelector('.devtitle');
      this.refreshButton = document.querySelector('.refresh');
      this.tweetButton = document.querySelector('.tweet');

      this.aboutButton = document.querySelectorAll('.about-btn');
      this.aboutModal = document.querySelector('.about');

      this.bindEvents();
    },

    bindEvents() {
      this.randomTitle();

      this.refreshButton.addEventListener('click', () => this.randomTitle());

      for (const button of this.aboutButton) {
        button.addEventListener('click', () => {
          this.toggleAboutModal();
        });
      }
    },

    toggleAboutModal() {
      const isActive = this.aboutModal.classList.contains('about--active');

      if (!isActive) {
        this.aboutModal.classList.add('about--active');
        this.aboutModal.setAttribute('aria-hidden', false);
      } else {
        this.aboutModal.classList.remove('about--active');
        this.aboutModal.setAttribute('aria-hidden', true);
      }
    },

    randomTitle(index) {
      // fix for 0 index
      const fixIndex = index == 0 ? '0' : index;
      const { titles } = data;
      const { length } = titles;
      const randomInt = !fixIndex ? this.randomInt(0, length - 1) : fixIndex;

      this.lastIndex = randomInt;

      const randomized = titles[randomInt];

      if (!randomized) return false;

      this.titleContainer.querySelector('h1').innerHTML = randomized.name;

      if (randomized.background) {
        document.body.style.backgroundColor = randomized.background;
        this.aboutModal.style.backgroundColor = randomized.background;
      } else {
        document.body.removeAttribute('style');
        this.aboutModal.removeAttribute('style');
      }

      if (randomized.color) document.body.style.color = randomized.color;
      else document.body.removeAttribute('style');

      if (randomized.credits) {
        const { credits } = randomized;

        let htmlString = '';

        htmlString += '<p>Credits to ';
        if (credits.url)
          htmlString += `<a href="${credits.url}" target="_blank" rel="noopener noreferrer">`;

        htmlString += `${credits.name}`;

        if (credits.url) htmlString += '</a>';

        htmlString += '</p>';

        this.titleContainer
          .querySelector('.devtitle__credit')
          .classList.add('devtitle__credit--visible');

        this.titleContainer.querySelector('.devtitle__credit').innerHTML = htmlString;
      } else {
        this.titleContainer
          .querySelector('.devtitle__credit')
          .classList.remove('devtitle__credit--visible');

        this.titleContainer.querySelector('.devtitle__credit').innerHTML = '';
      }

      this.tweetButton.setAttribute('href', this.generateShareLink(randomized.name));

      if (!this.isLocal) {
        analytics.sendEvent({
          hitType: 'event',
          eventCategory: 'Title',
          eventAction: 'Random title',
          eventLabel: randomized.name
        });
      }
    },

    generateShareLink(titleName) {
      const options = {
        username: 'juliolozovei',
        hashtags: 'developer,developertitles',
        url: 'https://developertitles.com/'
      };

      return encodeURI(
        `https://twitter.com/intent/tweet?url=${options.url}&text=I'm the "${titleName}". Check your title at Developer Titles&related=${options.username}&hashtags=${options.hashtags}`
      );
    },

    randomInt(min, max) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min;

      if (random === this.lastIndex) return this.randomInt(min, max);
      else return random;
    },

    goToTitle(index) {
      app.randomTitle(index);
    }
  };

  app.init();
})();
