import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return 'aff6c31546b04facacd59a81c54f967c'
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
