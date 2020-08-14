export function applyAuthPremium() {
  return { type: '@auth/APPLY_PREMIUM' }
}

export function authLogin(payload) {
  return {
    type: '@auth/LOGIN',
    payload
  }
}

export function authLogout() {
  return { type: '@auth/LOGOUT' }
}

export function removeAuthPremium() {
  return { type: '@auth/REMOVE_PREMIUM' }
}