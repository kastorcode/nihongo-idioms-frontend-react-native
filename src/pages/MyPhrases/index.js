import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import SearchBox from '../../components/SearchBox';
import ClickAnimation from '../../components/ClickAnimation';
import Title from '../../components/Title';
import ButtonsBar from '../../components/ButtonsBar';
import BarIcon from '../../components/BarIcon';
import { PhraseList } from '../../styles/global';
import { PhraseBox, PhraseHeader, PhraseText, PhraseBody, PhraseDate,
	PhraseReviews, PhraseDelete, PhraseDeleteIcon } from './style';

function MyPhrases({ navigation, theme }) {
	const [loading, setLoading] = useState(true);
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const { course } = useSelector(store => store.user);
	const [text, setText] = useState('');
	const [phrases, setPhrases] = useState([]);
	const [total, setTotal] = useState('...');
	const [end, setEnd] = useState(false);
	const [scroll, setScroll] = useState(null);

	async function getLearnedPhrases(last) {
		try {
			const response = await api.get(`/getLearnedPhrases`, {
				params: { session, course: course.short, last }
			});

			if (response.data.length) {
				const { data } = response;
				if (scroll === 'handleLearnedPhrases')
					setPhrases([...phrases, ...data]);
				else
					setPhrases(data);
			}
			else {
				setEnd(true);
			}
		}
		catch (error) {
			alert('A busca por frases aprendidas falhou.');
		}
		finally {
			setLoading(false);
		}
	}

	function handleLearnedPhrases() {
		let last = 0;
		if (scroll !== 'handleLearnedPhrases') {
			navigation.setOptions({
				title: 'Frases aprendidas'
			});
			getTotalLearned();
			setEnd(false);
			setScroll('handleLearnedPhrases');
		}
		else if (loading || end) {
			return;
		}
		else {
			last = phrases[phrases.length - 1].phrase_id;
		}

		setLoading(true);
		getLearnedPhrases(last);
	}

	async function searchMyPhrases(last, scrolling) {
		try {
			const response = scrolling ?
				await api.get(`/searchMyPhrases`, {
					params: { session, course: course.short, last, text }
				})
				:
				await api.get(`/searchMyPhrases`, {
					params: { session, course: course.short, text }
				});

			if (response.data.length) {
				const { data } = response;
				if (scrolling && scroll === 'handleSearchPhrases')
					setPhrases([...phrases, ...data]);
				else
					setPhrases(data);
			}
			else {
				if (!scrolling) setPhrases([]);
				setEnd(true);
			}
		}
		catch (error) {
			alert('A pesquisa falhou.');
		}
		finally {
			setLoading(false);
		}
	}

	function handleSearchPhrases(scrolling = true) {
		let last = 0;
		if (scroll !== 'handleSearchPhrases') {
			navigation.setOptions({
				title: 'Resultados da pesquisa'
			});
			setTotal('?');
			setEnd(false);
			setScroll('handleSearchPhrases');
		}
		else if (loading || (end && scrolling)) {
			return;
		}
		else {
			last = phrases[0] ? phrases[phrases.length - 1].phrase_id : 0;
		}

		setLoading(true);
		searchMyPhrases(last, scrolling);
	}

	function handleEndScroll() {
		switch(scroll) {
			case 'handleLearnedPhrases': {
				handleLearnedPhrases();
				break;
			}

			case 'handleSearchPhrases': {
				handleSearchPhrases();
				break;
			}
		}
	}

	async function deletePhrase(index, id) {
		setLoading(true);
		setPhrases(phrases.filter((item, i) => {
			return i != index;
		}));

		try {
			await api.get(`/deletePhrase`, {
				params: { session, id, course: course.short }
			});
		}
		catch (error) {
			alert('A exclusão da última frase falhou.');
		}
		finally {
			setLoading(false);
		}
	}

	async function getTotalLearned() {
		try {
			const response = await api.get(`/getTotalLearned`, {
				params: { session, course: course.short }
			});
			setTotal(response.data.total);
		}
		catch (error) {
			alert('Não foi possível pegar a quantidade de frases aprendidas.');
		}
	}

	async function getTotalPhrases() {
		try {
			const response = await api.get(`/getTotalPhrases`, {
				params: { session, course: course.short }
			});
			setTotal(response.data.total);
		}
		catch (error) {
			if (online)
				alert('Não foi possível pegar o total de frases.');
		}
		finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getTotalPhrases();
	}, [online]);

	if (online) {
		return (
			<Background>
				<Container scroll={true}>
					<Title>Total: {total}</Title>

					<SearchBox
						loading={loading}
						value={text}
						onChangeText={value => setText(value)}
						onSubmitEditing={() => handleSearchPhrases(false)}
					/>

					<ButtonsBar>
						<BarIcon
							loading={loading}
							name='leanpub'
							onPress={handleLearnedPhrases}
						/>
					</ButtonsBar>

					<PhraseList>
						<FlatList
			        data={phrases}
			        onEndReachedThreshold={0.1}
			        onEndReached={handleEndScroll}
			        keyExtractor={item => item.phrase_id}
			        renderItem={({item, index}) => (
			        	<PhraseBox theme={theme}>
									<PhraseHeader theme={theme}>
										<PhraseText theme={theme}>{ item.phrase }</PhraseText>
									</PhraseHeader>
									<PhraseBody>

										<PhraseDate>
											<PhraseText theme={theme}>{ item.last_revision }</PhraseText>
										</PhraseDate>
										<PhraseReviews>
											<PhraseText theme={theme}>Revisões: { item.revisions }</PhraseText>
										</PhraseReviews>
										<PhraseDelete>
											<TouchableOpacity
												activeOpacity={0.6}
												onPress={() => deletePhrase(index, item.phrase_id)}
											>
												<PhraseDeleteIcon name='trash' theme={theme} />
											</TouchableOpacity>
										</PhraseDelete>
									</PhraseBody>
								</PhraseBox>
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

export default withTheme(MyPhrases);