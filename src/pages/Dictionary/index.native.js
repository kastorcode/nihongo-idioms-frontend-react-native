import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import NoInternet from '../../components/NoInternet';
import { Browser } from './style';

export default function Dictionary({ route }) {
	const { online } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const { word } = route.params;

	useFocusEffect(
    useCallback(() => {
      EventRegister.emit('analyticsDictionaryEvent', word);
    }, [])
  );

	if (online) {
		return (
			<Browser
	    	source={{
	    		uri: course.dicio.replace('{word}', word)
	    	}}
	    />
		);
	}
	else {
		return (
			<NoInternet />
		);
	}
}