export default function ads(state = true, action) {
  switch (action.type) {

  	case '@ads/CHANGE': {
  		return action.payload;
    }

    default: return state;
  }
}