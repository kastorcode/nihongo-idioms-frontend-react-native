import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import * as WebBrowser from 'expo-web-browser';
import { EventRegister } from 'react-native-event-listeners';
import { clientID, redirectURI } from '../../config';
import api from '../../services/api';
import { changeAds } from '../../store/ads/actions';
import { authLogin } from '../../store/auth/actions';
import { userLogin } from '../../store/user/actions';
import Background from '../../components/Background';
import Loading from '../../components/Loading';
import ClickAnimation from '../../components/ClickAnimation';
import letters from '../../assets/images/letters.png';
import logo from '../../assets/images/logo-transparent.png';
import { Container, BackgroundImage, Header, HeaderBox1,
	Logo, Title, HeaderBox2, LoginButton, Body, Phrase } from './style';

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { online } = useSelector(store => store);
	const [phrases] = useState([
		{ text: 'Aprenda um novo idioma com a melhor metodologia do mundo!' },
		{ text: 'Estude quando e onde quiser!' },
		{ text: 'Simples e divertido!' },
		{ text: 'Converse com outros alunos!' },
		{ title: 'Repetição Espaçada', text: 'Construa seu vocabulário e esqueça de se esquecer!' },
		{ text: 'Interaja nos fóruns e saneie suas dúvidas!' },
		{ text: 'Crie novas possibilidades!' },
		{ title: 'É GRÁTIS!', text: 'Entre com sua conta do Google.' }
	]);
  const dispatch = useDispatch();

  function loginRequest(googleToken) {
    return new Promise((resolve, reject) => {
      api.get(`/enter`, {
        params: { googleToken }
      })
      .then(response => {
        dispatch(changeAds(response.data.ads));
        dispatch(userLogin(response.data.user));
        dispatch(authLogin(response.data.auth));
        resolve();
      })
      .catch(() => {
        setIsLoading(false);
        alert('Falha ao logar, por favor tente novamente.');
        reject();
      });
    })
    .then(() => {
      EventRegister.emit('updateLoginStorage');
    });
  }

  async function handleLogin() {
    if (!online) {
      alert('Você está offline! É necessário conexão com a internet para entrar na plataforma utilizando sua conta do Google.');
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `&client_id=${clientID}` +
      `&redirect_uri=${redirectURI}` +
      `&response_type=id_token` +
      `&scope=openid%20email%20profile` +
      `&nonce=n-0S6_WzA2Mj`
    );

    if (result.type == 'success') {
      setIsLoading(true);
      loginRequest(result.url.split('id_token=')[1].split('&', 1)[0]);
    }
    else {
      alert('A tentativa de login fracassou. Tente novamente ou use um navegador diferente.');
    }
  }

  if (isLoading) {
    return (
      <Background>
        <Loading />
      </Background>
    );
  }
  else {
    return (
      <Container>
        <BackgroundImage source={letters} resizeMode='stretch' />

        <Header>
          <HeaderBox1>
            <Logo source={logo} />
            <Title>NIHONGO IDIOMAS</Title>
          </HeaderBox1>

          <HeaderBox2>
            <ClickAnimation
              onPress={handleLogin}
            >
              <LoginButton>Login</LoginButton>
            </ClickAnimation>
          </HeaderBox2>
        </Header>

        <Body>
          <Carousel
            data={phrases}
            sliderWidth={360}
            itemWidth={360}
            loop={true}
            autoplay={true}
            autoplayInterval={4000}
            renderItem={({item}) => (
              <>
              { item.title && (<Phrase>{item.title}</Phrase>) }
              <Phrase>{item.text}</Phrase>
              </>
            )}
          />
        </Body>
      </Container>
    );
  }
}