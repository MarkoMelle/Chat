import LoginForm from './LoginForm';
import Chat from './Chat';
import ApiConnector from './ApiConnector';

document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://chat-97p7.onrender.com';
  const wsUrl = 'wss://chat-97p7.onrender.com';
  const apiConnector = new ApiConnector(apiUrl);
  const loginContainer = document.querySelector('.login-box');
  const chat = new Chat(document.querySelector('.chat-widget'), apiConnector, wsUrl);
  const loginForm = new LoginForm(loginContainer, chat, apiConnector);
  loginForm.init();
  window.api = new ApiConnector(apiUrl);
});
