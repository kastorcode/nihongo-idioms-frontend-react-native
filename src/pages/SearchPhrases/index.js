import React, { useState } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import api from '../../services/api';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import SearchBox from '../../components/SearchBox';
import { PhraseList, PhraseBox, OriginalPhrase, PhraseText,
	PhraseTranslation } from '../../styles/global';

function SearchPhrases({ theme }) {
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const { course } = useSelector(store => store.user);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState('');
	const [phrases, setPhrases] = useState([]);
	const [end, setEnd] = useState(false);

	async function addExistingPhrase(index, id) {
		setLoading(true);
		setPhrases(phrases.filter((item, i) => {
			return i != index;
		}));

		try {
			await api.get(`/addExistingPhrase`, {
				params: { session, id, course: course.short }
			});
		}
		catch (error) {
			alert('Falha ao adicionar a última frase.');
		}
		finally {
			setLoading(false);
		}
	}

	async function handleSearchPhrases(scrolling = true) {
		if (loading || (scrolling && end)) return;

		setLoading(true);
		const last = scrolling ? phrases[phrases.length - 1].id : 0;

		try {
			const response = await api.get(`/searchPhrases`, {
				params: { session, course: course.short, last, text }
			});
			const { length } = response.data;

			if (!length || length < 20) setEnd(true);
			if (length) {
				const { data } = response;
				if (scrolling)
					setPhrases([...phrases, ...data]);
				else
					setPhrases(data);
			}
		}
		catch (error) {
			alert('A pesquisa falhou.');
		}
		finally {
			setLoading(false);
			EventRegister.emit('analyticsSearchPhrases', { course: course.short, text });
		}
	}

	if (online) {
		return (
			<Background>
				<Container scroll={true}>
					<SearchBox
						loading={loading}
						value={text}
						onChangeText={value => setText(value)}
						onSubmitEditing={() => handleSearchPhrases(false)}
					/>

					<PhraseList>
						<FlatList
			        data={phrases}
			        onEndReachedThreshold={0.1}
			        onEndReached={handleSearchPhrases}
			        keyExtractor={item => item.id}
			        renderItem={({item, index}) => (
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

export default withTheme(SearchPhrases);