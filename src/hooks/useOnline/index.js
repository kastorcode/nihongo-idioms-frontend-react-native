import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { updateOnlineStatus } from '../../store/online/actions';

export default function useOnline() {
	const dispatch = useDispatch();

	useEffect(() => {
		NetInfo.isConnected.fetch().then(bool => {
	  	dispatch(updateOnlineStatus(bool));
	  });

		NetInfo.isConnected.addEventListener('connectionChange', bool => {
			dispatch(updateOnlineStatus(bool));
		});
	}, []);
}