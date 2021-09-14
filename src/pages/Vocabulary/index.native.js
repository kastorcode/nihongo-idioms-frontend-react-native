import React, { useState } from 'react';
import { withTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, MenuOptions, MenuTrigger, withMenuContext } from 'react-native-popup-menu';
import * as SQLite from 'expo-sqlite';
import { EventRegister } from 'react-native-event-listeners';
import { DB_NAME } from '../../config';
import { offlineMessage } from '../../utils';
import api from '../../services/api';
import { BannerAds, InterstitialAds } from '../../utils/ads';
import Header from '../../components/Header';
import RightMenuText from '../../components/RightMenuText';
import Background from '../../components/Background';
import Container from '../../components/Container';
import ClickAnimation from '../../components/ClickAnimation';
import { Revisions, RevisionsBox1, RevisionsTitle, MenuStyle, MenuTriggerStyles, RevisionsIcon, VocabularyMenu, VocabularyButton } from './style';

function Vocabulary({ ctx, theme }) {
	const [isLoading, setIsLoading] = useState(false);
	const {
		ads, online,
		auth: { session },
		revisions: { quantity },
		user: { course }
	} = useSelector(store => store);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [progress, setProgress] = useState(0);

	function handleRevisions() {
		if (quantity) {
			navigation.navigate('phrases', {
				training: false, day: null
			});
		}
		else {
			ctx.menuActions.openMenu('revisions');
		}
	}

	function navigate(training, day) {
		ctx.menuActions.closeMenu();
		navigation.navigate('phrases', {
			training, day
		});
	}

	async function syncAll(db) {
		return new Promise((resolve, reject) => {
			const inserted = () => {
				return new Promise((resolve, reject) => {
					db.transaction(tx => {
						const sql = `SELECT id FROM ${DB_NAME} WHERE course = ? LIMIT 1`;
						tx.executeSql(sql, [course.short],
							(transaction, result) => {
								resolve(result.rows.length);
							},
							reject
						);
					});
				});
			}

			inserted()
			.then(exist => {
				if (exist) {
					resolve();
				}
				else {
					api.get(`/syncAll`, { params: { session, course: course.short } })
					.then(resolve)
					.catch(reject);
				}
			})
			.catch(reject);
		});
	}

	async function getPhrases(db) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				const sql = `SELECT id, revisions, factor, review, last_revision FROM ${DB_NAME} WHERE course = ? AND sync = ?`;
				tx.executeSql(sql, [course.short, 1],
					(transaction, result) => {
						resolve(result.rows._array);
					},
					() => {
						reject();
					}
				);
			});
		});
	}

	async function syncServer(db, phrases) {
		return new Promise((resolve, reject) => {
			const inserted = (id) => {
				return new Promise((resolve, reject) => {
					db.transaction(tx => {
						const sql = `SELECT id FROM ${DB_NAME} WHERE id = ? AND course = ? LIMIT 1`;
						tx.executeSql(sql, [id, course.short],
							(transaction, result) => {
								resolve(result.rows.length);
							}
						);
					});
				});
			}

			api.get(`/syncDB`, { params: { session, course: course.short, phrases } })
			.then(response => {
				const { phrases } = response.data;
				const toAdd = phrases.filter(async item => {
					const exist = await inserted(item.id);
					if (exist) {
						db.transaction(tx => {
							const sql = `UPDATE ${DB_NAME} SET revisions = ?, factor = ?, review = ?, last_revision = ?, sync = ? WHERE id = ? AND course = ? AND last_revision < ?`;
							tx.executeSql(sql, [item.revisions, item.factor, item.review, item.last_revision, 0, item.id, course.short, item.last_revision]);
						});
						return false;
					}
					else {
						return true;
					}
				});

				Promise.all(toAdd)
				.then(toAdd => {
					resolve(toAdd);
				});
			})
			.catch(reject);
		});
	}

	async function addPhrases(db, toAdd) {
		return new Promise((resolve, reject) => {
			if (!toAdd.length) {
				resolve();
			}
			else {
				const ids = toAdd.map(item => {
					return item.id;
				});

				api.get(`/phraseAndTranslation`, { params: { session, course: course.short, ids }})
				.then(response => {
					const { data } = response;
					toAdd.forEach(item => {
						db.transaction(tx => {
							const sql = `INSERT INTO ${DB_NAME} VALUES (?,?,?,?,?,?,?,?,?)`;
							tx.executeSql(sql, [item.id, course.short, data[item.id]['phrase'], data[item.id]['translation'], item.revisions, item.factor, item.review, item.last_revision, 0]);
						});
					});
					resolve();
				})
				.catch(reject);
			}
		});
	}

	async function syncApp(db) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				const sql = `UPDATE ${DB_NAME} SET sync = ? WHERE course = ? AND sync = ?`;
				tx.executeSql(sql, [0, course.short, 1],
					() => {
						api.get(`/finishSyncDB`, { params: { session, course: course.short } })
						.then(() => {
							EventRegister.emit('clearRevisions');
							resolve();
						})
						.catch(reject);
					},
					() => {
						reject();
					}
				);
			});
		});
	}

	async function handleSync() {
		if (!online) {
			offlineMessage();
			return;
		}

		setProgress(0);
		setIsLoading(true);
		const db = SQLite.openDatabase(DB_NAME);

		syncAll(db)
		.then(() => {
			setProgress(20);
			getPhrases(db)
			.then(phrases => {
				setProgress(40);
				syncServer(db, phrases)
				.then(toAdd => {
					setProgress(60);
					addPhrases(db, toAdd)
					.then(() => {
						setProgress(80);
						syncApp(db)
						.then(() => {
							setIsLoading(false);
							alert('Sincronizado!');
						})
						.catch(() => {
							setIsLoading(false);
							alert('Falhamos ao atualizar o servidor.');
						});
					})
					.catch(() => {
						setIsLoading(false);
						alert('Falhamos ao atualizar suas frases no banco de dados.');
					});
				})
				.catch(() => {
					setIsLoading(false);
					alert('Falhamos ao sincronizar o servidor.');
				});
			})
			.catch(() => {
				setIsLoading(false);
				alert('Falhamos ao pegar suas frases no banco de dados.');
			});
		})
		.catch(() => {
			setIsLoading(false);
			alert('Falhamos nos preparativos para sincronizar.');
		});
	}

	if (isLoading) {
		return (
			<Background>
				<Container center={true}>
					<VocabularyButton theme={theme}>Sincronizando...</VocabularyButton>
					<VocabularyButton theme={theme}>{ progress }%</VocabularyButton>
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<Header />

				<Container>
					{ ads ? (
						<BannerAds style={{marginBottom:32}} theme={theme} />
					) : null }

					<Revisions theme={theme}>
						<RevisionsBox1
							theme={theme}
							activeOpacity={0.9}
							onPress={handleRevisions}
						>
							<RevisionsTitle theme={theme}>Frases para Revisar</RevisionsTitle>
							<RevisionsTitle theme={theme}>{ quantity }</RevisionsTitle>
						</RevisionsBox1>

						<Menu name='revisions' style={MenuStyle}>
		          <MenuTrigger customStyles={MenuTriggerStyles}>
		          	<RevisionsIcon name='caret-down' theme={theme} />
		          </MenuTrigger>
		          <MenuOptions>
		            <RightMenuText onPress={() => navigate(true, 2)} theme={theme}>
		              Hoje
		            </RightMenuText>
		            <RightMenuText onPress={() => navigate(true, 1)} theme={theme}>
		              Ontem
		            </RightMenuText>
		            <RightMenuText onPress={() => navigate(true, 3)} theme={theme}>
		              Amanhã
		            </RightMenuText>
		            <RightMenuText onPress={() => navigate(true, 0)} theme={theme}>
		              Aleatório
		            </RightMenuText>
		          </MenuOptions>
		        </Menu>
					</Revisions>

					<VocabularyMenu>
						<ClickAnimation onPress={() => navigation.navigate('addphrase')}>
							<VocabularyButton theme={theme}>Adicionar Frase</VocabularyButton>
						</ClickAnimation>
						<ClickAnimation onPress={() => navigation.navigate('myphrases')}>
							<VocabularyButton theme={theme}>Minhas Frases</VocabularyButton>
						</ClickAnimation>
						<ClickAnimation onPress={() => navigation.navigate('searchphrases')}>
							<VocabularyButton theme={theme}>Buscar Frases</VocabularyButton>
						</ClickAnimation>
						<ClickAnimation onPress={handleSync}>
							<VocabularyButton theme={theme}>Sincronizar Banco de Dados</VocabularyButton>
						</ClickAnimation>
					</VocabularyMenu>
				</Container>

				{ ads ? (
					<BannerAds theme={theme} />
				) : null }
			</Background>
		);
	}
}

export default withTheme(withMenuContext(Vocabulary));