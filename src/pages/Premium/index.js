import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as WebBrowser from 'expo-web-browser';
import Carousel from 'react-native-snap-carousel';
import { EventRegister } from 'react-native-event-listeners';
import api from '../../services/api';
import { applyAuthPremium, removeAuthPremium } from '../../store/auth/actions';
import { changeAds } from '../../store/ads/actions';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Container from '../../components/Container';
import Avatar from '../../components/Avatar';
import TwoColumns from '../../components/TwoColumns';
import CarouselImage from '../../components/CarouselImage';
import img1 from '../../assets/wallpapers/1.jpg';
import img2 from '../../assets/wallpapers/2.jpg';
import img3 from '../../assets/wallpapers/3.jpg';
import img4 from '../../assets/wallpapers/4.jpg';
import img5 from '../../assets/wallpapers/5.jpg';
import img6 from '../../assets/wallpapers/6.jpg';
import SearchBox from '../../components/SearchBox';
import ClickAnimation from '../../components/ClickAnimation';
import NoInternet from '../../components/NoInternet';
import { Button2 } from '../../styles/global';
import { ButtonsBox, Icon } from './style';

function Premium({ navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const { online, user } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const [premium, setPremium] = useState(null);
	const [premiumDate, setPremiumDate] = useState(null);
	const [images] = useState([
		{ source: img1, text: 'Obtenha acesso premium por um ano.' },
		{ source: img2, text: 'Remova os anúncios.' },
		{ source: img3, text: 'Use o app mobile offline.' },
		{ source: img4, text: 'Ajude a manter a plataforma de pé!' },
		{ source: img5, text: 'Apoie a educação gratuita!' },
		{ source: img6, text: 'Vamos juntos!' }
	]);
	const [price, setPrice] = useState('');
	const minimumPrice = useRef(null);
	const buyURL = useRef(null);
	const dispatch = useDispatch();

	async function getMinimumPrice() {
		return new Promise((resolve, reject) => {
			api.get(`/getMinimumPrice`)
			.then(response => {
				resolve(response.data.price);
			})
			.catch(reject);
		});
	}

	async function getBuyLink() {
		return new Promise((resolve, reject) => {
			api.get(`/getBuyLink`, {
				params: { session, price }
			})
			.then(response => {
				if (response.data.url) {
					resolve(response.data.url);
				}
				else {
					reject();
				}
			})
			.catch(reject);
		});
	}

	async function handlePurchase() {
		if (buyURL.current) {
			WebBrowser.openBrowserAsync(buyURL.current);
			return;
		}

		setIsLoading(true);

		try {
			if (premium) {
				if (!minimumPrice.current) {
					minimumPrice.current = await getMinimumPrice();
				}

				if (price < minimumPrice.current) {
					alert(`O valor mínimo é de R$ ${minimumPrice.current}`);
					setIsLoading(false);
					return;
				}
			}

			buyURL.current = await getBuyLink();
			WebBrowser.openBrowserAsync(buyURL.current);
		}
		catch (error) {
			alert('Não foi possível obter o link de compra.');
		}
		finally {
			setIsLoading(false);
		}

		EventRegister.emit('analyticsPremiumClicked');
	}

	function handleKeyboard(str) {
		let value = str.replace(',', '.');
		if (!isNaN(value)) {
			setPrice(value);
		}
	}

	async function getPremium() {
		try {
			const response = await api.get(`/getPremium`, {
				params: { session }
			});
			const { data } = response;
			setPremium(data.premium);
			setPremiumDate(data.date);

			if (data.premium) {
				dispatch(applyAuthPremium());
			}
			else {
				dispatch(removeAuthPremium());
				dispatch(changeAds(true));
			}
		}
		catch (error) {
			if (online)
				alert('Não foi possível pegar suas informações.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useFocusEffect(
    useCallback(() => {
    	setIsLoading(true);
			getPremium();
    }, [online])
  );

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

				<Container scroll={true}>
					<Avatar
						source={user.avatar}
						height={64}
						style={{ marginBottom: 16 }}
					/>

					<TwoColumns
						title='Premium ativo:'
						text={premium ? 'Sim' : 'Não'}
					/>
					{ premium ? (
						<TwoColumns
							title='Válido até:'
							text={premiumDate}
						/>
					) : null }

					<Carousel
	          data={images}
	          sliderWidth={366}
	          itemWidth={300}
	          loop={true}
	          autoplay={true}
	          autoplayInterval={4000}
	          layout='stack'
	          renderItem={({item}) => (
	          	<CarouselImage
	          		source={item.source}
	          		text={item.text}
	          	/>
	          )}
	        />

	        { premium ? (
	        	<SearchBox
		        	placeholder='Quanto quer pagar?'
		      		maxLength={6}
		      		value={price}
		      		text='Renovar'
		      		onChangeText={value => handleKeyboard(value)}
		      		onSubmitEditing={handlePurchase}
		      		keyboardType='decimal-pad'
		      	/>
	        ) : null }

	        <ButtonsBox>
		        <ClickAnimation
					    onPress={() => navigation.navigate('tutorial', { topic:'premium' })}
					    style={{ marginRight: 12 }}
					  >
					    <Button2 theme={theme}><Icon theme={theme} name='question-circle'/> Ajuda</Button2>
					  </ClickAnimation>
					  { premium ? null : (
					  	<ClickAnimation onPress={handlePurchase}>
						    <Button2 theme={theme}><Icon theme={theme} name='smile'/> Adquirir</Button2>
						  </ClickAnimation>
					  ) }
				  </ButtonsBox>
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

export default withTheme(Premium);