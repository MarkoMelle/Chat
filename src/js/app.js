import ApiConnector from "./ApiConnector";
import LoginForm from "./LoginForm";
import Chat from "./Chat";
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = new LoginForm(document.querySelector('.login-box'), new Chat(document.querySelector('.chat-box')));
  window.api = new ApiConnector('http://localhost:7070');
});
