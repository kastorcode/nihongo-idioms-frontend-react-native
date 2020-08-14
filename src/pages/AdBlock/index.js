import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { withTheme } from 'styled-components';
import Background from '../../components/Background';
import Container from '../../components/Container';
import Title from '../../components/Title';
import { Text } from './style';
import { TitleIcon } from '../../styles/global';

function AdBlock({ theme }) {

	useFocusEffect(
    useCallback(() => {
    	EventRegister.emit('analyticsAdBlockEvent');
    }, [])
  );

	return (
		<Background>
			<Container center={true}>
				<Title>AdBlock Detectado <TitleIcon name='emoticon-cry-outline' theme={theme} /></Title>

				<Text theme={theme}>Detectamos que você está usando um bloqueador de anúncios.</Text>
				<Text theme={theme}>Pedimos por favor que coloque a Nihongo em sua whitelist.</Text>
				<Text theme={theme}>A versão gratuita do sistema depende exclusivamente dos anúncios para sobreviver.</Text>
				<Text theme={theme}>Não se preocupe, nós também não gostamos de propagandas chatas e evasivas.</Text>
				<Text theme={theme}>Considere também um upgrade de conta para nos apoiar.</Text>
				<Text theme={theme}>Não se esqueça de atualizar a página.</Text>
				<Text theme={theme}>Obrigado e tenha um ótimo dia!</Text>
			</Container>
		</Background>
	);
}

export default withTheme(AdBlock);