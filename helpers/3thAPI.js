const { axios } = require('../apis');

module.exports = {
  pushNotification:  async (body, title, token) => {
    return axios({
      method: 'post',
      url: '/',
      data: {
        to: token,
        title,
        body
      }
    })
  }
}