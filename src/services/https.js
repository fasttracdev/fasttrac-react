// import { showErrorMsg } from './notification'
// import MESSAGES from './../configs/messages'
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000';
/**
 * Get Common Headers
 *
 * @return Headers
 */
export const getCommonHeaders = () => {
  try {
    var headers = {
      Accept: 'application/json',
      'x-consumer-username': 'onelogin',
      'Access-Control-Allow-Origin': '*'
    }
    return headers
  } catch (e) {
    return {}
  }
}

/**
 * GET Request
 *
 * @param url
 */
export const httpGet = url => {
  try {
    var combineUrl = API_BASE_URL + url;
    return axios
      .get(combineUrl, { headers: getCommonHeaders() })
      .then(res => httpHandleResponse(res))
      .catch(err => httpHandleError(err))
  } catch (e) {
    console.error('-- HTTP GET -- ', e)
    return Promise.reject({})
  }
}

/**
 * POST Request
 *
 * @param url
 * @param params
 */
export const httpPost = (url, params) => {
  try {
    var combineUrl = API_BASE_URL + url;
    return axios
      .post(combineUrl, params, { headers: getCommonHeaders() })
      .then(res => httpHandleResponse(res))
      .catch(err => httpHandleError(err))
  } catch (e) {
    console.error('-- HTTP POST -- ', e)
    return Promise.reject({})
  }
}

/**
 * PUT Request
 *
 * @param url
 * @param params
 */
export const httpPput = (url, params) => {
  try {
    var combineUrl = API_BASE_URL + url;
    return axios
      .put(combineUrl, params, { headers: getCommonHeaders() })
      .then(res => httpHandleResponse(res))
      .catch(err => httpHandleError(err))
  } catch (e) {
    console.error('-- HTTP PUT -- ', e)
    return Promise.reject({})
  }
}

/**
 * PATCH Request
 *
 * @param url
 * @param params
 */
export const httpPatch = (url, params) => {
  try {
    var combineUrl = API_BASE_URL + url;
    return axios
      .patch(combineUrl, params, { headers: getCommonHeaders() })
      .then(res => httpHandleResponse(res))
      .catch(err => httpHandleError(err))
  } catch (e) {
    console.error('-- HTTP PATCH -- ', e)
    return Promise.reject({})
  }
}

/**
 * DELETE Request
 *
 * @param url
 */
export const httpDelete = url => {
  try {
    var combineUrl = API_BASE_URL + url;
    return axios
      .delete(combineUrl, { headers: getCommonHeaders() })
      .then(res => httpHandleResponse(res))
      .catch(err => httpHandleError(err))
  } catch (e) {
    console.error('-- HTTP DELETE -- ', e)
    return Promise.reject({})
  }
}

/**
 * Handle Success Response
 *
 * @param res
 */
export const httpHandleResponse = res => {
  let r = res.data

  return Promise.resolve(r)
}

/**
 * Handle API Error Reponse
 *
 * @param err
 */
export const httpHandleError = error => {
  /* error = { error, config, code, request, response } */
  try {
    var xhr = error.request
    if (!xhr.response) {
      // showErrorMsg(MESSAGES.request_timeout)
      return Promise.reject({})
    }

    var err = extractJSON(xhr.response)

    if (xhr && xhr.status && err) {
      switch (xhr.status) {
        case 400:
          // showErrorMsg(err.error)
          break

        case 401:
          // case 402:
          // showErrorMsg('Session expired.')
          break

        case 404:
          // showErrorMsg(err.message)
          break

        case 412:
          // if (Object.keys(err.errors)[0] == 'q') {
          //   showErrorMsg('Please enter valid location.')
          // } else {
          //   showErrorMsg(err.errors[Object.keys(err.errors)[0]][0])
          // }
          break

        case 422:
          // showErrorMsg(err.message)
          break

        default:
          // showErrorMsg(MESSAGES.INTERNAL_ERROR)
      }
    } else {
      // showErrorMsg(MESSAGES.INTERNAL_ERROR)
    }
    return Promise.reject({})
  } catch (e) {
    return Promise.reject({})
  }
}

export const objectToURLEncoded = (url, Object) => {
  var encoded_data = ''
  for (var p in Object) {
    encoded_data = encoded_data + p + '=' + encodeURIComponent(Object[p]) + '&'
  }

  if (encoded_data === '') return ''
  else return url + '?' + encoded_data.substr(0, encoded_data.length - 1)
}

/**
 * Extract JSON Response
 *
 * @param json [JSON Data]
 *
 * @return Extarcted value or Blank Object
 */
export const extractJSON = json => {
  try {
    return JSON.parse(json)
  } catch (err) {
    return ''
  }
}
