import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StartappAds from 'react-native-startapp-ads-module';
import { startappID } from '../../config';

export default function useAds() {
	const { ads, online } = useSelector(store => store);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		console.log('AQUI: StartappAds:');//
		console.log(StartappAds);//
		if (ads && !loaded && online) {
			StartappAds.initialize(startappID, true);
			setLoaded(true);
		}
	}, [ads, online]);
}