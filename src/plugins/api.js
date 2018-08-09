import axios from './axios'
import { API_DEFAULT_CONFIG } from '../config'
import API_SERVICE from '../service/api'

const API = {}

const { prefix = '' } = API_DEFAULT_CONFIG

Object.keys(API_SERVICE).forEach(key => {
  const { method, url, defaultParams = {} } = API_SERVICE[key]
  API[key] = params => {
    const axiosConfig = {
      method,
      url: `${prefix}/${url}`,
      [method === 'get' ? 'params' : 'data']: { ...defaultParams, ...params }
    }
    return axios(axiosConfig)
  }
})

export default API
