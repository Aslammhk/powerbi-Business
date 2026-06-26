import axios from 'axios'

var BASE_URL = import.meta.env.VITE_API_URL || 'https://moneytube.onrender.com'

var api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: false
})

api.interceptors.request.use(function(config) {
  var token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

api.interceptors.response.use(
  function(response) { return response },
  function(error) {
    if (error.response && error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
