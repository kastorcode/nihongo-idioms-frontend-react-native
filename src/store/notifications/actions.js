export function decrementNotifications() {
  return { type: '@notifications/DECREMENT' }
}

export function updateNotifications(quantity, last) {
  return {
    type: '@notifications/UPDATE',
    payload: { quantity, last }
  }
}