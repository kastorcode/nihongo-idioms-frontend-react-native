import produce from 'immer';

const INITIAL_STATE = {
	logged: false
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {

      case '@auth/APPLY_PREMIUM': {
        draft.premium = 1;
        return draft;
      }

      case '@auth/LOGIN': {
        return action.payload;
      }

      case '@auth/LOGOUT': {
        return INITIAL_STATE;
      }

      case '@auth/REMOVE_PREMIUM': {
        draft.premium = 0;
        return draft;
      }

      default: return state;
    }
  });
}