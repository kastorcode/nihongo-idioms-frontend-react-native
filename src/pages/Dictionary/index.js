import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { withTheme } from 'styled-components';
import Background from '../../components/Background';
import NoInternet from '../../components/NoInternet';

function Dictionary({ route, theme }) {
  const { online } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
  const { word } = route.params;

  useFocusEffect(
    useCallback(() => {
      EventRegister.emit('analyticsDictionaryEvent', word);
    }, [])
  );

	return (
    <Background>
      { online ? (
        <iframe
          style={{
            width: '100%',
            maxWidth: 760,
            height: '100%',
            border: 0,
            backgroundColor: '#f2f2f2'
          }}
          src={course.dicio.replace('{word}', word)}
        />
      ) : (
        <NoInternet />
      ) }
    </Background>
  );
}

export default withTheme(Dictionary);