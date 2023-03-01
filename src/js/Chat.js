export default class Chat {
   constructor(chat) {
      this.chat = chat;
   }

   print() {
      console.log(this.user)
      this.chat.classList.remove('hidden');
   }
}