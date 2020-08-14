import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import aes from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import { cryptoKEY } from '../../config';
import useUpdateEffect from '../useUpdateEffect';
import { authLogin } from '../../store/auth/actions';
import { userLogin } from '../../store/user/actions';

export default function useLoginStorage() {
	const [loaded, setLoaded] = useState(false);
	const { auth, user } = useSelector(store => store);
	const dispatch = useDispatch();

	const getLoginStorage = () => {
		return new Promise(resolve => {
			AsyncStorage.multiGet(['@auth', '@user'])
			.then(storage => {
				if (storage[0][1] && storage[1][1]) {
					let bytes = aes.decrypt(storage[0][1], cryptoKEY);
					dispatch(userLogin(JSON.parse(storage[1][1])));
		  		dispatch(authLogin(JSON.parse(bytes.toString(utf8))));
		  		resolve();
		  	}
		  	else {
		  		resolve();
		  	}
			});
		});
	}

	const updateLoginStorage = () => {
		updateUserStorage().then(() => {
			updateAuthStorage();
		});
	}

	const updateAuthStorage = () => {
		return new Promise(resolve => {
      AsyncStorage.getItem('@auth')
      .then(storage => {
      	let bytes = aes.encrypt(JSON.stringify(auth), cryptoKEY).toString();
        if (bytes != storage) {
          AsyncStorage.setItem('@auth', bytes);
        }
        resolve();
      });
		});
	}

	const updateUserStorage = () => {
		return new Promise(resolve => {
			AsyncStorage.getItem('@user')
      .then(storage => {
        if (storage) {
          storage = JSON.parse(storage);
        }
        if (user != storage) {
          AsyncStorage.setItem('@user', JSON.stringify(user));
        }
        resolve();
      });
		});
	}

	useEffect(() => {
		if (!loaded) {
			getLoginStorage().then(() => {
				setLoaded(true);
			});
		}
	}, []);

	useEffect(() => {
		EventRegister.on('updateLoginStorage', updateLoginStorage);
	}, [auth, user]);

	useUpdateEffect(() => {
		updateAuthStorage();
	}, [auth]);

	useUpdateEffect(() => {
		updateUserStorage();
	}, [user]);

  return loaded;
}