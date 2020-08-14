import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import useUpdateEffect from '../useUpdateEffect';
import api from '../../services/api';
import { changeAds } from '../../store/ads/actions';
import { removeAuthPremium } from '../../store/auth/actions';

export default function usePremium() {
	const { ads, online } = useSelector(store => store);
	const { premium, session } = useSelector(store => store.auth);
	const dispatch = useDispatch();

	const updateAdsStorage = () => {
		return new Promise(resolve => {
			if (ads) {
				AsyncStorage.removeItem('@ads');
			}
			else {
				AsyncStorage.setItem('@ads', false);
			}
			resolve();
		});
	}

	const getAdsStorage = () => {
		return new Promise(resolve => {
			AsyncStorage.getItem('@ads').then(storage => {
				if (storage === 'false') {
	    		dispatch(changeAds(false));
	    	}
	    	resolve();
			});
		});
	}

	const resetValues = () => {
		dispatch(removeAuthPremium());
		dispatch(changeAds(true));
	}

	const checkPremium = () => {
		return new Promise(resolve => {
			api.get('/checkPremium', { params: { session } })
			.then(response => {
				if (!response.data.premium) {
					resetValues();
				}
				resolve();
			})
			.catch(() => {
				resetValues();
				resolve();
			});
		});
	}

	useEffect(() => {
		if (premium) {
			getAdsStorage();
		}
	}, [premium]);

	useEffect(() => {
		if (online) {
			if (premium || !ads) {
				checkPremium();
			}
		}
	}, [ads, online, premium]);

	useUpdateEffect(() => {
		updateAdsStorage();
	}, [ads]);
}