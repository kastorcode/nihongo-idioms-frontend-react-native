import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import { offlineMessage } from '../../utils';
import api from '../../services/api';
import { DIR_DB } from '../../config';
import { authLogout } from '../../store/auth/actions';
import Background from '../../components/Background';
import Loading from '../../components/Loading';

export default function Logout({ navigation }) {
  const {
    online,
    auth: { session }
  } = useSelector(store => store);
  const dispatch = useDispatch();

  async function makeLogout() {
    try {
      await api.get(`/logout`, {
        params: { session }
      });
    }
    finally {
      try {
        await FileSystem.deleteAsync(DIR_DB);
      }
      finally {
        EventRegister.emit('analyticsLogoutEvent');
        await AsyncStorage.clear();
        dispatch(authLogout());
      }
    }
  }

  async function handleLogout() {
    if (online) {
      Alert.alert(
        'Logoff',
        'Todas as alterações feitas no seu vocabulário não sincronizadas serão perdidas. Tem certeza que deseja continuar?',
        [
          { text: 'Não', onPress: () => navigation.navigate('vocabulary') },
          { text: 'Sim', onPress: makeLogout }
        ],
        { cancelable: false }
      );
    }
    else {
      navigation.goBack();
      offlineMessage();
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleLogout();
    }, [online])
  );

  return (
  	<Background>
  		<Loading />
  	</Background>
  );
}