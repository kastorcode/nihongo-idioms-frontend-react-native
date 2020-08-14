import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Background from '../../components/Background';
import NoInternet from '../../components/NoInternet';
import Container from '../../components/Container';
import ClickAnimation from '../../components/ClickAnimation';
import { ModulesList, ModuleBox, ModuleText } from '../../styles/global';

function Modules({ navigation, theme }) {
	const [isLoading, setIsLoading] = useState(false);
	const { online } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const { session } = useSelector(store => store.auth);
	const [courseModules, setCourseModules] = useState([]);

	function navigate(index, courseModule) {
		navigation.navigate('module', { index, courseModule });
	}

	async function getModules() {
		const storage = await AsyncStorage.getItem(`@modules/${course.short}`);
		if (storage) {
			setCourseModules(JSON.parse(storage));
			return;
		}

		setIsLoading(true);
		try {
			const response = await api.get(`/getModules`, {
				params: { session, course: course.short }
			});
			const { data } = response;
			setCourseModules(data);
			AsyncStorage.setItem(`@modules/${course.short}`, JSON.stringify(data));
		}
		catch (error) {
			if (online)
				alert('Não foi possível acessar os módulos do curso.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getModules();
	}, [online]);

	if (isLoading) {
		return (
			<Background>
				<Header />
				<Loading />
			</Background>
		);
	}
	else if (courseModules.length || online) {
		return (
			<Background>
				<Header />

				<Container scroll={true}>
					<ModulesList>
						<FlatList
			        data={courseModules}
			        keyExtractor={item => item.id}
			        renderItem={({item, index}) => (
			        	<ClickAnimation
			        		style={{ marginBottom: 24 }}
			        		onPress={() => navigate(index, item)}
			        	>
									<ModuleBox theme={theme}>
										<ModuleText theme={theme}>{`Módulo ${index + 1} - ${item.title}`}</ModuleText>
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

export default withTheme(Modules);