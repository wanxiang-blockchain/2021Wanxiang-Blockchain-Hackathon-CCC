import * as constants from './constants'

export const setAuthStatus = (value) => ({
  type: constants.SET_AUTH_STATUS,
  value
})

export const setIdentity = (value) => ({
  type: constants.SET_IDENTITY,
  value
})

export const setAuthToken = (text) => ({
  type: constants.SET_AUTH_TOKEN,
  value: text
})
