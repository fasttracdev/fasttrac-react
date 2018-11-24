export default class Environment {
  getENV() {
    var API_BASE_URL = ''
    var CLIENTID = ''
    var APP_BASE_URL = ''
    var data = {}
    if (process.env.NODE_ENV === 'development') {
      API_BASE_URL = 'http://localhost:3000'
      APP_BASE_URL = 'http://localhost:8000'
      CLIENTID = '1xw2DSMpt6VAdbH7bZH9XKnRBOX9D2M7'
    }else {
      API_BASE_URL = process.env.REACT_APP_API_URL
      APP_BASE_URL = 'http://localhost:8000'
      CLIENTID = process.env.REACT_APP_API_CLIENTID
    }  
    data = {
      API_BASE_URL: API_BASE_URL,
      CLIENTID: CLIENTID,
      APP_BASE_URL: APP_BASE_URL,
      CODE: 'code',
      SCOPE: 'email openid',
      DOMAIN: 'ddx.auth0.com'
    }
    return data
  }
}
