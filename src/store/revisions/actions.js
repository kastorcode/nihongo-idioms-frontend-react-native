export function decrementRevisions() {
  return { type: '@revisions/DECREMENT' }
}

export function updateRevisions(quantity, last) {
  return {
    type: '@revisions/UPDATE',
    payload: { quantity, last }
  }
}