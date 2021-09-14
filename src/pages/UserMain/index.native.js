import React, { useState, useRef, useEffect } from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';
import * as WebBrowser from 'expo-web-browser';
import Carousel,{ Pagination } from 'react-native-snap-carousel';
import { baseURL } from '../../config';
import api from '../../services/api';
import { BannerAds } from '../../utils/ads';
import { changeUserCourse } from '../../store/user/actions';
import { offlineMessage } from '../../utils';
import Header from '../../components/Header';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { MenuStyle, MenuTriggerStyles, MenuOptionsStyles,
	CourseMenuTitle, Cards, Card, CardHeader, CardHeaderText, CardBody,
	CardBodyText, MainAd, MainAdImage } from './style';

function UserMain({ theme }) {
	const {
		ads, notifications, online, revisions,
		auth: { session },
		user: { course, myCourses }
	} = useSelector(store => store);
	const [mainAd, setMainAd] = useState(null);
	const [index, setIndex] = useState(0);
	const carouselRef = useRef();
	const dispatch = useDispatch();
	const navigation = useNavigation();

	function carousel() {
		return (
			<Carousel
				ref={carouselRef}
	  		data={mainAd}
	      sliderWidth={375}
	      itemWidth={375}
	      loop={true}
	      autoplay={true}
	      autoplayInterval={30000}
	      onSnapToItem={index => setIndex(index)}
	      renderItem={({item}) => (
	      	<MainAd onPress={() => handleMainAd(item.id)} activeOpacity={0.6}>
	  				<MainAdImage source={{ uri: item.img }} resizeMode='stretch' theme={theme} />
	  			</MainAd>
	      )}
	  	/>
		);
	}

	function pagination() {
		return (
	    <Pagination
	    	carouselRef={carouselRef}
	    	tappableDots={true}
	      dotsLength={mainAd.length}
	      activeDotIndex={index}
	      activeOpacity={0.8}
	      inactiveDotOpacity={1}
	      inactiveDotScale={1}
	      dotStyle={{
	        width: 12,
	        height: 12,
	        borderRadius: 6,
	        marginHorizontal: 4,
	        backgroundColor: theme.header.menu.bg
	      }}
	      containerStyle={{
	      	paddingVertical: 28
	      }}
	      inactiveDotStyle={{
	      	backgroundColor: theme.bar.bg
	      }}
	    />
		);
	}

	async function changeCourse(course) {
		dispatch(changeUserCourse(course));

		if (online) {
			api.get(`/changeCourse`, {
				params: { session, course: course.short }
			})
			.catch(() => {
				alert('A mudança de curso falhou.');
			});
		}
	}

	async function handleMainAd(id) {
		const link = `${baseURL}/mainAdClick?id=${id}`;
		WebBrowser.openBrowserAsync(link);
	}

	async function getMainAd() {
		api.get(`/getMainAd`)
		.then(response => {
			if (response.data.ad.length) {
				setMainAd(response.data.ad);
			}
		});
	}

	useEffect(() => {
		if (!mainAd && online) {
			getMainAd();
		}
	}, [online]);

  return (
  	<Background>
	  	<Header />

	  	<Container scroll={mainAd} center={!mainAd}>
	  		{ ads ? (
					<BannerAds style={{marginBottom:32}} theme={theme} />
				) : null }

		  	<Menu renderer={renderers.Popover} style={MenuStyle(theme)}>
		  		<CourseMenuTitle theme={theme}>Curso</CourseMenuTitle>
	      	<MenuTrigger customStyles={MenuTriggerStyles(theme)} text={course.full} />
		      <MenuOptions customStyles={MenuOptionsStyles(theme)}>
		      	<FlatList
			        data={myCourses}
			        keyExtractor={item => item.short}
			        renderItem={({item}) => (
			        	<MenuOption onSelect={() => changeCourse(item)} text={item.full} />
			        )}
			      />
		      </MenuOptions>
		    </Menu>

		    <Cards>
		    	<Card onPress={() => navigation.navigate('vocabulary')} theme={theme}>
		    		<CardHeader theme={theme}>
		    			<CardHeaderText theme={theme}>Frases para Revisar</CardHeaderText>
		    		</CardHeader>
		    		<CardBody>
		    			<CardBodyText theme={theme}>{ revisions.quantity }</CardBodyText>
		    		</CardBody>
		    	</Card>
		    	<Card onPress={() => navigation.navigate('notifications')} theme={theme}>
		    		<CardHeader theme={theme}>
		    			<CardHeaderText theme={theme}>Notificações</CardHeaderText>
		    		</CardHeader>
		    		<CardBody>
		    			<CardBodyText theme={theme}>{ notifications.quantity }</CardBodyText>
		    		</CardBody>
		    	</Card>
		    </Cards>

		    { mainAd ? [
		    	pagination(),
		    	carousel(),
		    	pagination()
		    ] : null }
		  </Container>
		  { ads ? (
				<BannerAds theme={theme} />
			) : null }
	  </Background>
  );
}

export default withTheme(UserMain);