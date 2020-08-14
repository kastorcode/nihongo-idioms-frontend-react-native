export function addMyCourses(course) {
  return {
    type: '@user/ADD_COURSE',
    payload: course
  }
}

export function changeUserAuto() {
  return { type: '@user/CHANGE_AUTO' }
}

export function changeUserCourse(course) {
  return {
    type: '@user/CHANGE_COURSE',
    payload: course
  }
}

export function changeUserGender(gender) {
  return {
    type: '@user/CHANGE_GENDER',
    payload: gender
  }
}

export function changeUserName(name) {
  return {
    type: '@user/CHANGE_NAME',
    payload: name
  }
}

export function changeUserRepro(repro) {
  return {
    type: '@user/CHANGE_REPRO',
    payload: repro
  }
}

export function changeUserTheme() {
  return { type: '@user/CHANGE_THEME' }
}

export function userLogin(state) {
  return {
    type: '@user/LOGIN',
    payload: state
  }
}