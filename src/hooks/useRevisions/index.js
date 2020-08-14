import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import useUpdateEffect from '../useUpdateEffect';
import api from '../../services/api';
import { calculateDate } from '../../utils';
import { updateRevisions } from '../../store/revisions/actions';

export default function useRevisions() {
	const [loaded, setLoaded] = useState(false);
	const { online, revisions } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const { session } = useSelector(store => store.auth);
	const dispatch = useDispatch();

	const updateRevisionsStorage = () => {
		return new Promise(resolve => {
			AsyncStorage.getItem('@revisions')
      .then(storage => {
        if (storage) {
          storage = JSON.parse(storage);
        }
        if (revisions != storage) {
          AsyncStorage.setItem('@revisions', JSON.stringify(revisions));
        }
        resolve();
      });
		});
	}

	const checkRevisions = () => {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem('@revisions')
	    .then(storage => {
	    	if (storage) storage = JSON.parse(storage);
	    	const today = calculateDate(0);
	      if (!storage || today > storage.last) {
	      	api.get(`/getRevisions`, { params: { session, course: course.short } })
					.then(response => {
	  				dispatch(updateRevisions(response.data.revisions, today));
	  				resolve();
					})
					.catch(reject);
	      }
	      else {
	      	dispatch(updateRevisions(storage.quantity, storage.last));
	      	resolve();
	      }
	    });
		});
	}

	useEffect(() => {
		if (revisions.last != '0000-00-00') {
			updateRevisionsStorage();
		}
	}, [revisions]);

	useUpdateEffect(() => {
		if (online) {
			setLoaded(false);
		}
	}, [online]);

	useUpdateEffect(() => {
		AsyncStorage.removeItem('@revisions')
		.then(() => {
			setLoaded(false);
		});
	}, [course]);

	if (!loaded && session) {
		setLoaded(true);
		checkRevisions();
	}

	return loaded;
}