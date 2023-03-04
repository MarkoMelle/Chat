import { createPopper } from '@popperjs/core';

export default class LoginForm {
  constructor(container, Chat, apiConnector) {
    this.container = container;
    this.loader = document.querySelector('.loader-box');
    this.form = this.container.querySelector('.login-box__form');
    this.chat = Chat;
    this.input = this.form.querySelector('.user-box__input');
    this.submitBtn = this.form.querySelector('.btn');
    this.tooltip = this.form.querySelector('.tooltip');
    this.tooltipText = this.form.querySelector('.tooltip__text');
    this.api = apiConnector;
    this.banner = document.querySelector('.banner-box');
  }

  init() {
    this.form.addEventListener('submit', this.submit.bind(this));
    this.inputLabel = this.form.querySelector('.user-box__input-label');
    this.input.onblur = () => {
      if (this.input.value.length !== 0) {
        this.inputLabel.classList.add('label-up');
      } else {
        this.inputLabel.classList.remove('label-up');
      }
    };
    this.input.onfocus = () => { this.inputLabel.classList.add('label-up'); };

    try {
      this.user = JSON.parse(localStorage.getItem('current'));
      this.input.value = this.user ? this.user.name : '';
      if (this.input.value) this.input.focus();
    } catch (e) {
      localStorage.removeItem('current');
      throw new Error(e);
    }
    this.checkUser();
  }

  async checkUser() {
    if (this.user) {
      const response = await this.api.addUser(this.user);
      if (response.status === 'username exists') {
        this.showTooltip('Это имя уже занято');
        this.input.addEventListener('input', () => {
          this.tooltip.classList.add('hidden');
        });
      } else if (response.status === 'OK') {
        this.authorization(this.user);
      } else if (!response) {
        const banner = document.createElement('p');
        banner.className = 'banner-box__text';
        banner.textContent = 'Ошибка соединения с сервером, попробуйте позже';
        this.banner.appendChild(banner);
        this.banner.classList.remove('hidden');
      }
    }
  }

  async submit(e) {
    e.preventDefault();
    const user = { name: this.input.value };
    if (this.validate() === false) return;

    const response = await this.api.addUser(user);
    if (response.status === 'username exists') {
      this.showTooltip('Это имя уже занято');
      this.input.addEventListener('input', () => {
        this.tooltip.classList.add('hidden');
      });
    } else if (response.status === 'OK') {
      this.user = user;
      this.authorization(this.user);
      localStorage.setItem('current', JSON.stringify(user));
    }
  }

  authorization(user) {
    this.api.addUser(user);
    this.container.classList.add('hidden');

    this.chat.init(user);
  }

  static addArrow(tooltip) {
    const arrow = document.createElement('div');
    arrow.className = 'tooltip__arrow';
    arrow.dataset.popperArrow = '';
    tooltip.appendChild(arrow);
  }

  showTooltip(message) {
    this.tooltip.textContent = message;
    LoginForm.addArrow(this.tooltip);
    createPopper(this.input, this.tooltip, {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 20],
          },
        },
      ],
    });
    this.tooltip.classList.remove('hidden');
    this.input.addEventListener('input', () => this.tooltip.classList.add('hidden'));
    this.input.focus();
  }

  validate() {
    let result = true;
    if (this.input.value === '') {
      result = false;
      this.showTooltip('Пожалуйста введите имя');
    } else if (this.input.value.length > 16) {
      result = false;
      this.showTooltip('Максимальная длинна имени 16 символов');
      this.input.addEventListener('input', (e) => {
        if (e.target.value.length <= 16) {
          this.tooltip.classList.add('hidden');
        }
      });
      this.input.focus();
    }
    return result;
  }
}
