import React, { useCallback } from 'react';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { BannerAds } from '../../utils/ads';
import NoInternet from '../../components/NoInternet';
import { Browser } from './style';

function Dictionary({ route, theme }) {
	const {
		ads,
		online,
		user: { course }
	} = useSelector(store => store);
	const { word } = route.params;

	useFocusEffect(
    useCallback(() => {
      EventRegister.emit('analyticsDictionaryEvent', word);
    }, [])
  );

	if (online) {
		return (
			<>
			<Browser
	    	source={{
	    		uri: course.dicio.replace('{word}', word)
	    	}}
	    />
	    { ads ? (
				<BannerAds theme={theme} />
			) : null }
			</>
		);
	}
	else {
		return (
			<NoInternet />
		);
	}
}

export default withTheme(Dictionary);