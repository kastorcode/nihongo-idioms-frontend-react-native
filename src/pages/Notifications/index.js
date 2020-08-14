import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { calculateDate } from '../../utils';
import { updateNotifications } from '../../store/notifications/actions';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import Title from '../../components/Title';
import ButtonsBar from '../../components/ButtonsBar';
import BarIcon from '../../components/BarIcon';
import ListContainer from '../../components/ListContainer';
import ModuleBox from '../../components/ModuleBox';

function Notifications({ navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const [waiting, setWaiting] = useState(true);
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const [notices, setNotices] = useState([]);
	const dispatch = useDispatch();

	function navigate(item) {
		navigation.navigate('notification', { item });

		setNotices(notices.filter(i => {
			return i.id != item.id;
		}));
	}

	async function clearNotifications() {
		if (!notices.length) return;

		setWaiting(true);

		try {
			await api.get(`/clearNotifications`, {
				params: { session }
			});
			setNotices([]);
			const today = calculateDate(0);
			dispatch(updateNotifications(0, today));
		}
		catch (error) {
			alert('Não foi possível limpar suas notificações.');
		}
		finally {
			setWaiting(false);
		}
	}

	async function getNotifications() {
		setWaiting(true);

		try {
			const response = await api.get(`/getNotifications`, {
				params: { session }
			});
			const { data } = response;
			
			const my = data.my.filter(item => {
				return item['type'] = 'my';
			});
			const notices = data.notices.filter(item => {
				return item['type'] = 'notice';
			});

			setNotices([...my, ...notices]);
		}
		catch (error) {
			alert('A tentativa de puxar notificações falhou.');
		}
		finally {
			setWaiting(false);
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getNotifications();
	}, []);

	if (isLoading) {
		return (
			<Background>
				<Header />
				<Loading />
			</Background>
		);
	}
	else if (online) {
		return (
			<Background>
				<Header />

				<Container scroll={notices.length}>
					<Title>Notificações</Title>

					<ButtonsBar>
						<BarIcon
							loading={waiting}
							name='sync-alt'
							onPress={getNotifications}
						/>
						<BarIcon
							loading={waiting}
							name='broom'
							onPress={clearNotifications}
						/>
					</ButtonsBar>

					{ notices.length ? (

						<ListContainer>
							<FlatList
				        data={notices}
				        keyExtractor={item => item.id}
				        renderItem={({item}) => (
				        	<ModuleBox
				        		title={item.date ? `[${item.date}] ${item.title}` : `${item.title}`}
				        		onPress={() => navigate(item)}
				        	/>
				        )}
					    />
						</ListContainer>

					) : (

						<Empty />

					) }
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

export default withTheme(Notifications);