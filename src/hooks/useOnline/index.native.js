import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { updateOnlineStatus } from '../../store/online/actions';

export default function useOnline() {
	const dispatch = useDispatch();

	useEffect(() => {
		NetInfo.fetch().then(state => {
	  	dispatch(updateOnlineStatus(state.isConnected));
	  });

		NetInfo.addEventListener(state => {
			dispatch(updateOnlineStatus(state.isConnected));
		});
	}, []);
}