import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { decrementNotifications } from '../../store/notifications/actions';
import Loading from '../../components/Loading';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import Title from '../../components/Title';
import Text from '../../components/Text';

function Notification({ route, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const {
		ads,
		online,
		auth: { session }
	} = useSelector(store => store);
	const [content, setContent] = useState('');
	const dispatch = useDispatch();
	const { item } = route.params;

	async function getNotification() {
		try {
			const response = await api.get(`/getNotification`, {
				params: { session, type:item.type, id:item.id }
			});
			setContent(response.data.content);
			dispatch(decrementNotifications());
		}
		catch (error) {
			alert('Falha ao puxar a notificação.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getNotification();
	}, []);

	if (isLoading) {
		return (
			<Background>
				<Loading />
			</Background>
		);
	}
	else if (online) {
		return (
			<Background>
				<Container scroll={true}>
					<Title>{ item.title }</Title>
					<Text>{ content }</Text>
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

export default withTheme(Notification);