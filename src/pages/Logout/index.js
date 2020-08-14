import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import { offlineMessage } from '../../utils';
import api from '../../services/api';
import { authLogout } from '../../store/auth/actions';
import Background from '../../components/Background';
import Loading from '../../components/Loading';

export default function Logout({ navigation }) {
  const { online } = useSelector(store => store);
  const { session } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  async function handleLogout() {
  	if (!online) {
  		navigation.goBack();
  		offlineMessage();
  		return;
  	}

  	try {
      await api.get(`/logout`, {
        params: { session }
      });
    }
    finally {
      EventRegister.emit('analyticsLogoutEvent');
      await AsyncStorage.clear();
      dispatch(authLogout());
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