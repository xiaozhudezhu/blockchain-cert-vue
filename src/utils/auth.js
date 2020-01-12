import Cookies from 'js-cookie'

const TokenKey = 'Login-Token'
const CurrentUserKey = 'Current-User'

export function getToken() {
  //return 'aff6c31546b04facacd59a81c54f967c'
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getCurrentUser() {
  let userStr = localStorage.getItem(CurrentUserKey)
  if(userStr) {
    return JSON.parse(userStr)
  }
  return null;
}

export function setCurrentUser(user) {
  return localStorage.setItem(CurrentUserKey, JSON.stringify(user))
}

export function removeCurrentUser() {
  return localStorage.removeItem(CurrentUserKey)
}
