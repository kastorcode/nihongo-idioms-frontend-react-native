import React from 'react';
import { withTheme } from 'styled-components';
import Container from '../../components/Container';
import { Icon, Text } from './style';

function NoInternet({ theme }) {
	return (
		<Container center={true}>
			<Icon theme={theme} name='wifi-strength-off' />
			<Text theme={theme}>Sem conexão</Text>
		</Container>
	);
}

export default withTheme(NoInternet);