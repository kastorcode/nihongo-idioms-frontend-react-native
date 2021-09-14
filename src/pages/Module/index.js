import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Background from '../../components/Background';
import NoInternet from '../../components/NoInternet';
import Container from '../../components/Container';
import Title from '../../components/Title';
import { PhraseList, PhraseBox, OriginalPhrase, PhraseText, PhraseTranslation } from '../../styles/global';
import { ExplanationBox, ExplanationText } from './style';

function Module({ route, theme }) {
	const [isLoading, setIsLoading] = useState(false);
	const {
		ads,
		online,
		auth: { session },
		user: { course }
	} = useSelector(store => store);
	const [explanation, setExplanation] = useState('');
	const [phrases, setPhrases] = useState([]);
	const { index, courseModule } = route.params;

	async function addExistingPhrase(index, id) {
		setPhrases(phrases.filter((item, i) => {
			return i != index;
		}));

		try {
			await api.get(`/addExistingPhrase`, {
				params: { session, course: course.short, id }
			});
		}
		catch (error) {
			alert('Falha ao tentar adicionar a última frase.');
		}
	}

	async function getModule() {
		let storage = await AsyncStorage.getItem(`@module/${course.short}/${courseModule.id}`);
		if (storage) {
			storage = JSON.parse(storage);
			setExplanation(storage.explanation);
			setPhrases(storage.phrases);
			return;
		}

		setIsLoading(true);
		try {
			const response = await api.get(`/getModule`, {
				params: { session, course: course.short, id: courseModule.id }
			});
			const { data } = response;
			setExplanation(data.explanation);
			setPhrases(data.phrases);
			AsyncStorage.setItem(`@module/${course.short}/${courseModule.id}`, JSON.stringify(data));
		}
		catch (error) {
			if (online)
				alert('Não foi possível acessar este módulo.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getModule();
	}, []);

	if (isLoading) {
		return (
			<Background>
				<Loading />
			</Background>
		);
	}
	else if (explanation || online) {
		return (
			<Background>
				<Container scroll={true}>
					<Title>{`Módulo ${index + 1} - ${courseModule.title}`}</Title>

					<ExplanationBox>
						<ExplanationText theme={theme}>{ explanation }</ExplanationText>
					</ExplanationBox>

					<PhraseList>
						<FlatList
			        data={phrases}
			        keyExtractor={item => item.id}
			        renderItem={({index, item}) => (
			        	<View style={{ marginBottom:20 }}>
				        	<TouchableOpacity
										activeOpacity={0.6}
										onPress={() => addExistingPhrase(index, item.id)}
									>
										<PhraseBox theme={theme}>
											<OriginalPhrase theme={theme}>
												<PhraseText theme={theme}>{ item.phrase }</PhraseText>
											</OriginalPhrase>
											<PhraseTranslation>
												<PhraseText theme={theme}>{ item.translation }</PhraseText>
											</PhraseTranslation>
										</PhraseBox>
									</TouchableOpacity>
								</View>
			        )}
			      />
					</PhraseList>
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<NoInternet />
			</Background>
		);
	}
}

export default withTheme(Module);