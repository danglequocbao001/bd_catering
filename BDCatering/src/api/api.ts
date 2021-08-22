import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { storage } from '../helpers'
import { actions } from '../redux'

const api = axios.create({
  baseURL: 'https://freeapi.code4func.com/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  },
  paramsSerializer: params => queryString.stringify(params),
})

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  try {
    const token = await storage.get('token')
    token && (config.headers['Authorization'] = `${token}`)
  } catch (error) { }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response.data
  },
  err => {
    if (err.response.status == 401) {
      const dispatch = useDispatch()
      dispatch(actions.auth.logout())
      storage.clear()
      throw 'Login session expired'
    } else {
      throw err.response.data.message
    }
  }
)

export default api