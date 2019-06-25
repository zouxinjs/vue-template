import axios from '@/services/axios'
import { API_DEFAULT_CONFIG, CONSOLE_RESPONSE_ENABLE } from '@/config'

const requestQueue = []

export default async function request (item, params, options) {
  const requestItem = getRequestItem(item, params, options)

  if (!await requestStart(requestItem)) {
    // eslint-disable-next-line
    return Promise.reject('abort by start')
  }

  requestQueueSplice(requestItem)
  // eslint-disable-next-line
  return await requestReturn(requestItem)
}

function getRequestItem (item, params, options) {
  const { method, url } = item

  const requestItem = {
    header: {},
    method,
    url: `${API_DEFAULT_CONFIG.prefix}${url}`,
    [method === 'get' ? 'params' : 'data']: params,
    options: {
      ...API_DEFAULT_CONFIG,
      ...options
    }
  }

  return requestItem
}

function requestStart (requestItem) {
  const { isAllowMultipleRequest } = requestItem.options

  if (!isAllowMultipleRequest && requestQueue.find(item => item.url === requestItem.url)) return false

  requestQueuePush(requestItem)
  return true
}

async function requestReturn (requestItem) {
  const { isUseStorage } = requestItem.options

  let storageKey = ''
  if (isUseStorage) {
    storageKey = requestItem.url + JSON.stringify(requestItem[requestItem.method === 'get' ? 'params' : 'data'])
    const storageData = localStorage.getItem(storageKey)
    if (storageData) {
      const res = JSON.parse(storageData)
      // eslint-disable-next-line
      CONSOLE_RESPONSE_ENABLE && console.info('responseSuccess', '\n', res)
      return res
    }
  }

  const res = await axios(requestItem)
  if (isUseStorage && storageKey) localStorage.setItem(storageKey, JSON.stringify(res))
  return res
}

function requestQueuePush (requestItem) {
  requestQueue.push(requestItem)
}

function requestQueueSplice (requestItem) {
  requestQueue.splice(requestQueue.findIndex(item => item.url === requestItem.url), 1)
}
