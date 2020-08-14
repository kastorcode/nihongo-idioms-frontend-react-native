import produce from 'immer';

export default function notifications(state = { quantity: 0, last: '0000-00-00' }, action) {
  return produce(state, draft => {
    switch (action.type) {

      case '@notifications/DECREMENT': {
        if (draft.quantity) {
          draft.quantity--;
        }
        return draft;
      }

      case '@notifications/UPDATE': {
        return action.payload;
      }

      default: return state;
    }
  });
}