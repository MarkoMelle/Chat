export default class ApiConnector {
  constructor(url) {
    this.url = url;
  }

  async fetchRequest(URLSearchParam, method, headers, body) {
    function handleErrors(response) {
      if (!response.ok) {
        return response;
      }

      return response;
    }
    const response = await fetch(this.url + URLSearchParam, { method, headers, body })
      .then(handleErrors)
      .then((res) => res.json())
      .catch((error) => error.status === 404);
    return response;
  }

  addUser(username) {
    return this.fetchRequest('/usernames', 'POST', {
      'Content-Type': 'application/json;charset=utf-8',
    }, JSON.stringify(username));
  }

  deleteUser(username) {
    return this.fetchRequest(`/usernames/${encodeURIComponent(username.name)}`, 'DELETE', {
      'Content-Type': 'application/json;charset=utf-8',
    });
  }
}
