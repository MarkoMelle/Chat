export default class ApiConnector {
   constructor(url) {
      this.url = url;
   }
   async fetchRequest(URLSearchParam, method, headers, body) {
      // const urlRequest = Object.keys(new URLSearchParams(URLSearchParam)).length === 0 ? URLSearchParam : new URLSearchParams(URLSearchParam);
      // console.log(urlRequest)
      function handleErrors(response) {
         if (!response.ok) {
            return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
         }
         return response;
      }

      const response = await fetch(this.url + URLSearchParam, { method, headers, body })
         .then(handleErrors)
         .then((res) => res.json())
         .catch((error) => Promise.reject(new Error(`${error.status}: ${error.statusText}`)));
      return response;
   }

   addUser(username) {
      return this.fetchRequest('/usernames', 'POST', {
         'Content-Type': 'application/json;charset=utf-8',
      }, JSON.stringify(username));
   }

   deleteUser(username) {
      return this.fetchRequest('/usernames/' + encodeURIComponent(username.name), 'DELETE', {
         'Content-Type': 'application/json;charset=utf-8',
      });
   }
}