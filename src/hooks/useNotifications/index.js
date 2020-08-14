import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { calculateDate } from '../../utils';
import { updateNotifications } from '../../store/notifications/actions';

export default function useNotifications() {
	const [loaded, setLoaded] = useState(false);
	const { notifications, online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const dispatch = useDispatch();

	const updateNotificationsStorage = () => {
		return new Promise(resolve => {
			AsyncStorage.getItem('@notifications')
      .then(storage => {
        if (storage) {
          storage = JSON.parse(storage);
        }
        if (notifications != storage) {
          AsyncStorage.setItem('@notifications', JSON.stringify(notifications));
        }
        resolve();
      });
		});
	}

	const checkNotifications = () => {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem('@notifications')
	    .then(storage => {
	    	if (storage) storage = JSON.parse(storage);
	    	const today = calculateDate(0);
	      if (online && !storage || today > storage.last) {
	      	api.get(`/checkNotifications`, { params: { session } })
					.then(response => {
	  				dispatch(updateNotifications(response.data.notifications, today));
	  				resolve();
					})
					.catch(reject);
	      }
	      else {
	      	dispatch(updateNotifications(storage.quantity, storage.last));
	      	resolve();
	      }
	    });
		});
	}

	useEffect(() => {
		if (notifications.last != '0000-00-00') {
			updateNotificationsStorage();
		}
	}, [notifications]);

	useEffect(() => {
		if (online) {
			setLoaded(false);
		}
	}, [online]);

	if (!loaded && session) {
		setLoaded(true);
		checkNotifications();
	}

	return loaded;
}