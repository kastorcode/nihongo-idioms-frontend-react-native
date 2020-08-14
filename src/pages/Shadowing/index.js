import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import Title from '../../components/Title';
import { ModulesList, ModuleBox, ModuleText } from '../../styles/global';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import ClickAnimation from '../../components/ClickAnimation';

function Shadowing({ navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const { online } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const { session } = useSelector(store => store.auth);
	const [texts, setTexts] = useState({});

	function navigate(item) {
		navigation.navigate('shadowingtext', { item });
	}

	function separateByLevel(data) {
		let basic = [];
		let intermediary = [];
		let advanced = [];

		data.forEach(item => {
			switch(item.level) {
				case '0': {
					basic.push(item);
					break;
				}
				case '1': {
					intermediary.push(item);
					break;
				}
				case '2': {
					advanced.push(item);
					break;
				}
			}
		});

		return { basic, intermediary, advanced };
	}

	async function getTexts() {
		const storage = await AsyncStorage.getItem(`@shadowing/${course.short}`);
		if (storage) {
			setTexts(JSON.parse(storage));
			setIsLoading(false);
			return;
		}

		try {
			const response = await api.get(`/getTexts`, {
				params: { session, course: course.short }
			});
			const data = separateByLevel(response.data);
			setTexts(data);
			AsyncStorage.setItem(`@shadowing/${course.short}`, JSON.stringify(data));
		}
		catch (error) {
			if (online)
				alert('Erro ao tentar pegar a lista de textos.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getTexts();
	}, [online]);

	if (isLoading) {
		return (
			<Background>
				<Header />
				<Loading />
			</Background>
		);
	}
	else if (texts.basic) {
		return (
			<Background>
				<Header />

				<Container scroll={true}>
					<Title>Básico</Title>

					<ModulesList>
						<FlatList
			        data={texts.basic}
			        keyExtractor={item => item.id}
			        renderItem={({item}) => (
			        	<ClickAnimation
			        		style={{ marginBottom: 24 }}
			        		onPress={() => navigate(item)}
			        	>
									<ModuleBox theme={theme}>
										<ModuleText theme={theme}>{ item.title }</ModuleText>
									</ModuleBox>
								</ClickAnimation>
			        )}
				    />
					</ModulesList>

					<Title>Intermediário</Title>
					<ModulesList>
						<FlatList
			        data={texts.intermediary}
			        keyExtractor={item => item.id}
			        renderItem={({item}) => (
			        	<ClickAnimation
			        		style={{ marginBottom: 24 }}
			        		onPress={() => navigate(item)}
			        	>
									<ModuleBox theme={theme}>
										<ModuleText theme={theme}>{ item.title }</ModuleText>
									</ModuleBox>
								</ClickAnimation>
			        )}
				    />
					</ModulesList>

					<Title>Avançado</Title>
					<ModulesList>
						<FlatList
			        data={texts.advanced}
			        keyExtractor={item => item.id}
			        renderItem={({item}) => (
			        	<ClickAnimation
			        		style={{ marginBottom: 24 }}
			        		onPress={() => navigate(item)}
			        	>
									<ModuleBox theme={theme}>
										<ModuleText theme={theme}>{ item.title }</ModuleText>
									</ModuleBox>
								</ClickAnimation>
			        )}
				    />
					</ModulesList>
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

export default withTheme(Shadowing);