import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { withTheme } from 'styled-components';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import Background from '../../components/Background';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Title from '../../components/Title';
import Topic from '../../components/Topic';
import NoInternet from '../../components/NoInternet';
import { ListContainerStyled } from './style';

function Tutorial({ route, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const [topic, setTopic] = useState(route.params.topic);
	const [topics, setTopics] = useState([]);
	const { online } = useSelector(store => store);

	async function getTutorial() {
		try {
			const storage = await AsyncStorage.getItem(`@tutorial`);
			if (storage) {
				setTopics(JSON.parse(storage));
			}
			else if (online) {
				const response = await api.get(`/getTutorial`);
				const { tutorial } = response.data;
				setTopics(tutorial);
				AsyncStorage.setItem(`@tutorial`, JSON.stringify(tutorial));
			}
		}
		catch (error) {
			alert('Erro ao tentar acessar o tutorial.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useFocusEffect(
    useCallback(() => {
    	if (!topics.length) {
    		getTutorial();
    	}
    }, [online])
  );

	useFocusEffect(
    useCallback(() => {
    	setTopic(route.params.topic);
    }, [route.params.topic])
  );

  if (isLoading) {
		return (
			<Background>
				<Header />
				<Loading />
			</Background>
		);
	}
	else if (topics.length) {
		return (
			<Background>
				<Header />

				<Container scroll={true}>
					<Title>Página de Ajuda</Title>

					<ListContainerStyled>
						<FlatList
			        data={topics}
			        extraData={topic}
			        keyExtractor={item => item.topic}
			        renderItem={({item}) => (
			        	<Topic
			        		title={item.title}
			        		text={item.text}
			        		icon={item.icon}
			        		topic={item.topic}
			        		route={topic}
			        	/>
			        )}
				    />
					</ListContainerStyled>
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<Header />
				<NoInternet />
			</Background>
		);
	}
}

export default withTheme(Tutorial);