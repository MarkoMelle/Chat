import { createPopper } from '@popperjs/core';
import ApiConnector from './ApiConnector';
export default class LoginForm {
   constructor(container, Chat) {
      this.container = container
      this.loader = document.querySelector('.loader-box')
      this.form = this.container.querySelector('.login-box__form');
      this.chat = Chat;
      this.input = this.form.querySelector('.user-box__input');
      this.submitBtn = this.form.querySelector('.btn');
      this.tooltip = this.form.querySelector('.tooltip');
      this.tooltipText = this.form.querySelector('.tooltip__text');
      this.api = new ApiConnector('http://localhost:7070')

      this.submitBtn.addEventListener('click', this.submit.bind(this));
      this.inputLabel = this.form.querySelector('.user-box__input-label')
      this.input.onblur = () => {
         if (this.input.value.length !== 0) {
            this.inputLabel.classList.add('label-up')
         } else {
            this.inputLabel.classList.remove('label-up')
         }
      }
      this.input.onfocus = () => { this.inputLabel.classList.add('label-up') }
      window.onbeforeunload = () => {
         console.log('Unloading');
         this.api.deleteUser(this.user);
      }
   }

   async submit(e) {
      e.preventDefault();
      const user = { name: this.input.value }
      if (this.validate() === false) return;
      const response = await this.api.addUser(user);
      if (response.status === 'username exists') {
         this.showTooltip('Это имя уже занято');
         this.input.addEventListener('input', (e) => {
            this.tooltip.classList.add('hidden');
         });
      } else if (response.status === 'OK') {
         this.user = user;
         this.container.classList.add('hidden');
         this.loader.classList.remove('hidden');
         setTimeout(() => {
            this.loader.classList.add('hidden');
            this.chat.user = user;
            this.chat.init();
         }, 5000)
      }
   }

   addArrow(tooltip) {
      const arrow = document.createElement('div');
      arrow.className = 'tooltip__arrow';
      arrow.dataset.popperArrow = ''
      tooltip.appendChild(arrow);
   }

   showTooltip(message) {
      this.tooltip.textContent = message
      this.addArrow(this.tooltip);
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
         this.showTooltip('Пожалуйста введите имя')
      } else if (this.input.value.length > 16) {
         result = false;
         this.showTooltip('Максимальная длинна имени 16 символов')
         this.input.addEventListener('input', (e) => {
            if (e.target.value.length <= 16) {
               this.tooltip.classList.add('hidden')
            } else {
               return
            }
         });
         this.input.focus();
      }
      return result;
   };


}

