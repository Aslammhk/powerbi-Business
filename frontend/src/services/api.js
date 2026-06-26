import axios from 'axios'

// HARDCODED to moneytube backend - DO NOT CHANGE
var API_URL = 'https://moneytube.onrender.com'

console.log('===========================================')
console.log('API connecting to:', API_URL)
console.log('===========================================')

var api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  withCredentials: false
})

api.interceptors.request.use(function(config) {
  var token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  console.log('REQUEST:', config.method.toUpperCase(), config.baseURL + config.url)
  return config
})

api.interceptors.response.use(
  function(response) {
    console.log('RESPONSE OK:', response.status)
    return response
  },
  function(error) {
    console.error('REQUEST ERROR:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('URL:', error.config.url)
      console.error('Data:', error.response.data)
    }
    if (error.response && error.response.status === 401) {
      localStorage.clear()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
