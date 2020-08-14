export default function online(state = null, action) {
  switch (action.type) {

    case '@online/UPDATE_STATUS': {
      return action.payload;
    }

    default: return state;
  }
}