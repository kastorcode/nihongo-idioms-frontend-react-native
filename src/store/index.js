import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ads from './ads/reducer';
import auth from './auth/reducer';
import notifications from './notifications/reducer';
import online from './online/reducer';
import revisions from './revisions/reducer';
import user from './user/reducer';

export const store = createStore(
	combineReducers({
		ads, auth, notifications, online, revisions, user
	}),
	applyMiddleware(thunk)
);