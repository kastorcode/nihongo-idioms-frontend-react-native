import produce from 'immer';

export default function revisions(state = { quantity: 0, last: '0000-00-00' }, action) {
  return produce(state, draft => {
    switch (action.type) {

      case '@revisions/DECREMENT': {
        draft.quantity--;
        return draft;
      }

      case '@revisions/UPDATE': {
        return action.payload;
      }

      default: return state;
    }
  });
}