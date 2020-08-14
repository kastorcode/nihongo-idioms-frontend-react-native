export function updateOnlineStatus(bool) {
  return {
    type: '@online/UPDATE_STATUS',
    payload: bool
  }
}