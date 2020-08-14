import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../config';
import { offlineMessage } from '../../utils';
import api from '../../services/api';
import Background from '../../components/Background';
import Container from '../../components/Container';
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
	const [db] = useState(SQLite.openDatabase(DB_NAME));

	async function getLearnedPhrases(last) {
		db.transaction(tx => {
			const sql = `SELECT id, phrase, revisions, last_revision FROM ${DB_NAME} WHERE id > ? AND course = ? AND factor > ? LIMIT 20`;
			tx.executeSql(sql, [last, course.short, 30],
				(transaction, result) => {
					if (result.rows.length) {
						const array = result.rows._array;
						if (scroll == 'handleLearnedPhrases')
							setPhrases([...phrases, ...array]);
						else
							setPhrases(array);
					}
					else {
						setEnd(true);
					}
				},
				() => {
					alert('A busca por frases aprendidas falhou.');
				}
			);
		});

		setLoading(false);
	}

	function handleLearnedPhrases() {
		let last = 0;
		if (scroll != 'handleLearnedPhrases') {
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
			last = phrases[phrases.length - 1].id;
		}

		setLoading(true);
		getLearnedPhrases(last);
	}

	async function searchMyPhrases(last, scrolling) {
		db.transaction(tx => {
			const sql = `SELECT id, phrase, revisions, last_revision FROM ${DB_NAME} WHERE phrase LIKE '%${text}%' AND id > ? AND course = ? LIMIT 20`;
			tx.executeSql(sql, [scrolling ? last : 0, course.short],
				(transaction, result) => {
					if (result.rows.length) {
						const array = result.rows._array;
						if (scrolling && scroll == 'handleSearchPhrases')
							setPhrases([...phrases, ...array]);
						else
							setPhrases(array);
					}
					else {
						setEnd(true);
						if (!scrolling) setPhrases([]);
					}
				},
				() => {
					alert('A pesquisa falhou.');
				}
			);
		});

		setLoading(false);
	}

	function handleSearchPhrases(scrolling = true) {
		let last = 0;
		if (scroll != 'handleSearchPhrases') {
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
			last = phrases[0] ? phrases[phrases.length - 1].id : 0;
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
		if (!online) {
			offlineMessage();
			return;
		}

		setPhrases(phrases.filter((item, i) => {
			return i != index;
		}));

		api.get(`/deletePhrase`, {
			params: { session, id, course: course.short }
		})
		.then(() => {
			db.transaction(tx => {
				const sql = `DELETE FROM ${DB_NAME} WHERE id = ? AND course = ?`;
				tx.executeSql(sql, [id, course.short]);
			});
		})
		.catch(() => {
			alert('A exclusão da última frase falhou.');
		});
	}

	async function getTotalLearned() {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				const sql = `SELECT id FROM ${DB_NAME} WHERE course = ? AND factor > ?`;
				tx.executeSql(sql, [course.short, 30],
					(transaction, result) => {
						setTotal(result.rows.length);
						resolve();
					},
					() => {
						alert('Não foi possível pegar a quantidade de frases aprendidas.');
						reject();
					}
				);
			});
		});
	}

	async function getTotalPhrases() {
		db.transaction(tx => {
			const sql = `SELECT id FROM ${DB_NAME} WHERE course = ?`;
			tx.executeSql(sql, [course.short],
				(transaction, result) => {
					setTotal(result.rows.length);
					setLoading(false);
				},
				() => {
					alert('Não foi possível pegar o total de frases.');
				}
			);
		});
	}

	useEffect(() => {
		getTotalPhrases();
	}, []);

	return (
		<Background>
			<Container scroll={true}>
				<Title>Total: { total }</Title>

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
		        keyExtractor={item => item.id.toString()}
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
											onPress={() => deletePhrase(index, item.id)}
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

export default withTheme(MyPhrases);