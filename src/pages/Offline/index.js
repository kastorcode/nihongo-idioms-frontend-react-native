import React from 'react';
import { withTheme } from 'styled-components';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Container from '../../components/Container';
import Title from '../../components/Title';
import { TitleIcon } from '../../styles/global';

function Offline({ theme }) {
	return (
		<Background>
			<Header />

			<Container center={true}>
				<Title>Sem conexão <TitleIcon name='wifi-strength-off' theme={theme} /></Title>
				<Title>É necessário conexão com a internet para usar a versão gratuita.</Title>
			</Container>
		</Background>
	);
}

export default withTheme(Offline);