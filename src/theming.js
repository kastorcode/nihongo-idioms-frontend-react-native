import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { ThemeProvider } from 'styled-components';
import useLoginStorage from './hooks/useLoginStorage';
import useTheme from './hooks/useTheme';
import useOnline from './hooks/useOnline';
import useDirectories from './hooks/useDirectories';
import useDatabase from './hooks/useDatabase';
import useRevisions from './hooks/useRevisions';
import useNotifications from './hooks/useNotifications';
import usePremium from './hooks/usePremium';
import useAnalytics from './hooks/useAnalytics';
import Routes from './routes';

export default function Theming() {
	const login = useLoginStorage();
	const theme = useTheme();
	useOnline();
	useDirectories();
	useDatabase();
	useRevisions();
	useNotifications();
	usePremium();
	useAnalytics();

	if (login && theme) {
		return (
			<ThemeProvider theme={theme}>
				<StatusBar backgroundColor={theme.header.bg} />
		    <Routes />
		  </ThemeProvider>
		);
	}
	else {
  	return (
  		<AppLoading />
  	);
  }
}