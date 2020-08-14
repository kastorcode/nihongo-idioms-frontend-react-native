import React from 'react';
import { useFonts } from '@use-expo/font';
import { Provider } from 'react-redux';
import { store } from './store';
import { MenuProvider } from 'react-native-popup-menu';
import { AppLoading } from 'expo';
import Theming from './theming';

export default function Index() {
	let [fontsLoaded] = useFonts({
    'DINNextRoundedLTPro-Regular': require('./assets/fonts/DINNextRoundedLTPro-Regular.ttf'),
	  'DINNextRoundedLTPro-Bold': require('./assets/fonts/DINNextRoundedLTPro-Bold.ttf')
  });

  if (fontsLoaded) {
  	return (
  		<Provider store={store}>
        <MenuProvider backHandler={true}>
    		  <Theming />
        </MenuProvider>
    	</Provider>
  	);
  }
  else {
  	return (
  		<AppLoading />
  	);
  }
}