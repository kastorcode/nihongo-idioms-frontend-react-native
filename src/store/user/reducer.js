import produce from 'immer';

const INITIAL_STATE = {
  course: {},
  name: '',
  theme: 0
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {

      case '@auth/LOGOUT': {
        return INITIAL_STATE;
      }

      case '@user/ADD_COURSE': {
        const course = action.payload;
        draft.myCourses = state.myCourses.filter(item => {
          return item.short != course.short;
        });
        draft.myCourses.push(course);
        return draft;
      }

      case '@user/CHANGE_AUTO': {
        draft.auto = !draft.auto;
        return draft;
      }

      case '@user/CHANGE_COURSE': {
        draft.course = action.payload;
        return draft;
      }

      case '@user/CHANGE_GENDER': {
        draft.gender = action.payload;
        return draft;
      }

      case '@user/CHANGE_NAME': {
        draft.name = action.payload;
        return draft;
      }

      case '@user/CHANGE_REPRO': {
        draft.repro = Number(action.payload);
        return draft;
      }

      case '@user/CHANGE_THEME': {
        draft.theme = !draft.theme;
        return draft;
      }

      case '@user/LOGIN': {
        draft = action.payload;
        draft.auto = Number(draft.auto);
        draft.repro = Number(draft.repro);
        draft.theme = Number(draft.theme);
        return draft;
      }

      default: return state;
    }
  });
}