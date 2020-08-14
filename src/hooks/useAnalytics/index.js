import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import * as firebase from 'firebase';
import * as Analytics from 'expo-firebase-analytics';
import { firebaseConfig } from '../../config';

export default function useAnalytics() {
	const { ads, auth, user } = useSelector(store => store);

	const analyticsAdBlockEvent = async () => {
		await Analytics.logEvent('adblock', {
			os: Platform.OS
		});
	}

	const analyticsDictionaryEvent = async (word) => {
		await Analytics.logEvent('dicio', { word });
	}

	const analyticsLogoutEvent = async () => {
		await Analytics.logEvent('logout', {
			method: Platform.OS
		});
	}

	const analyticsPremiumClicked = async () => {
		await Analytics.logEvent('premium_clicked', {
			os: Platform.OS
		});
	}

	const analyticsSearchPhrases = async ({ course, text }) => {
		await Analytics.logEvent('search_phrases', { course, text });
	}

	const loggedEvent = async () => {
		try {
			await Analytics.setUserId(auth.id);
			await Analytics.setUserProperties({
				ads: ads.toString(),
				auto: user.auto.toString(),
				course: user.course.short.toString(),
				gender: user.gender.toString(),
				premium: auth.premium.toString(),
				repro: user.repro.toString(),
				theme: user.theme.toString()
			});
			await Analytics.logEvent('login', {
				method: Platform.OS
			});
		}
		finally {
			EventRegister.on('analyticsAdBlockEvent', analyticsAdBlockEvent);
			EventRegister.on('analyticsDictionaryEvent', analyticsDictionaryEvent);
			EventRegister.on('analyticsLogoutEvent', analyticsLogoutEvent);
			EventRegister.on('analyticsPremiumClicked', analyticsPremiumClicked);
			EventRegister.on('analyticsSearchPhrases', analyticsSearchPhrases);
		}
	}

	useEffect(() => {
		if (Platform.OS == 'web') {
			firebase.initializeApp(firebaseConfig);
		}
	}, []);

	useEffect(() => {
		if (auth.logged) {
			loggedEvent();
		}
	}, [auth.logged]);
}