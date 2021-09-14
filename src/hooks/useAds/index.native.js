import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Startapp from 'rn-startapp-simple';
import { startappID } from '../../config';

export default function useAds() {
	const { ads, online } = useSelector(store => store);
	const [loaded, setLoaded] = useState(false);
	const [ready, setReady] = useState(false);

	async function load() {
		try {
			await Startapp.initialize(startappID, false);
			await Startapp.initializeTest(startappID, false);
			await Startapp.setUserConsent(true);
			setLoaded(true);
		}
		finally {
			setReady(true);
		}
	}

	useEffect(() => {
		if (ads && !loaded) {
			if (online) {
				load();
			}
			else {
				setReady(true);
			}
		}
	}, [ads, online]);

	return ready;
}