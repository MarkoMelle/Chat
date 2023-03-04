export default class Chat {
  constructor(chat, apiConnector, wsUrl) {
    this.chat = chat;
    this.wsUrl = wsUrl;
    this.api = apiConnector;
    this.usernamesList = this.chat.querySelector('.usernames-box__list');
    this.chatMessages = this.chat.querySelector('.chat');
    this.input = this.chat.querySelector('.chat__input');
    this.submitBtn = this.chat.querySelector('.chat_submit-btn');

    this.loader = document.querySelector('.loader-box');
    this.logoutBtn = this.chat.querySelector('.logout-btn');
    this.banner = document.querySelector('.banner-box');
  }

  init(user) {
    this.loader.classList.remove('hidden');
    this.user = user;
    this.chat.classList.remove('hidden');
    this.loader.classList.remove('hidden');

    this.ws = new WebSocket(`${this.wsUrl}/?name=${this.user.name}`);
    this.ws.addEventListener('open', this.wsOnopen.bind(this));
    this.ws.addEventListener('close', () => {

    });
    this.ws.addEventListener('message', this.wsOnmessage.bind(this));

    this.logoutBtn.addEventListener('click', this.logout.bind(this));
    this.submitBtn.addEventListener('click', this.submitMessage.bind(this));
  }

  renderUsernames() {
    this.usernamesList.textContent = '';
    this.usernames.forEach((username) => {
      const li = document.createElement('li');
      li.className = 'usernames-box__item';
      li.textContent = username.name;
      this.usernamesList.appendChild(li);
    });
  }

  submitMessage(e) {
    e.preventDefault();
    if (this.input.value.trim() === '') return;
    const messageText = this.input.value.trim();
    const message = {
      username: this.user.name,
      date: new Date().toLocaleString('ru', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
        .replace(/,/g, ''),
      message: messageText,
    };
    this.ws.send(JSON.stringify(message));
    this.input.value = '';
    this.submitBtn.blur();
  }

  static onAppend(elem, f) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.addedNodes.length) {
          f(m.addedNodes);
        }
      });
    });
    observer.observe(elem, { childList: true });
  }

  wsOnopen() {
    Chat.onAppend(this.usernamesList, () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.loader.classList.add('hidden');
      }, 1000);
    });
  }

  wsOnmessage(event) {
    const data = JSON.parse(event.data);
    if (data.dataType === 'usernames') {
      this.usernames = data.usernames;
      this.renderUsernames();
    } else if (data.dataType === 'messages') {
      data.messages.forEach((item) => {
        const user = item.username === this.user.name ? 'You' : item.username;
        const message = document.createElement('div');
        message.className = 'chat__message';
        if (user === 'You') message.dataset.current = '';
        message.innerHTML = `<span class="chat__message-meta">${user} - ${item.date}</span>
               <p class="chat__message-text">${item.message}</p>`;
        this.chatMessages.appendChild(message);
      });
      const lastMessage = this.chatMessages.lastElementChild;
      if (lastMessage) lastMessage.scrollIntoView();
    } else if (data.dataType === 'message') {
      const user = data.message.username === this.user.name ? 'You' : data.message.username;
      const message = document.createElement('div');
      message.className = 'chat__message';
      if (user === 'You') message.dataset.current = '';
      message.innerHTML = `<span class="chat__message-meta">${user} - ${data.message.date}</span>
               <p class="chat__message-text">${data.message.message}</p>`;
      this.chatMessages.appendChild(message);
      message.scrollIntoView();
    }
  }

  async logout() {
    localStorage.removeItem('current');
    await this.api.deleteUser(this.user);
    window.location.reload();
  }
}
