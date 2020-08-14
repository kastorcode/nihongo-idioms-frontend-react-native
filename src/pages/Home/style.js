import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
	flex: 1;
	align-items: center;
	background-color: #be0029;
`;

export const BackgroundImage = styled.ImageBackground`
	position: absolute;
	right: 2%;
	bottom: 1%;
	width: 140px;
  height: 529px;
`;

export const Header = styled.View`
	flex-direction: column;
	margin-top: 12px;
	max-width: 375px;
`;

export const HeaderBox1 = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-bottom: 12px;
`;

export const Logo = styled.Image`
	width: 48px;
	height: 48px;
	margin-right: 12px;
`;

export const Title = styled.Text`
	font-family: 'DINNextRoundedLTPro-Bold';
	font-size: 24px;
	color: #f2f2f2;
`;

export const HeaderBox2 = styled.View`
	flex-direction: row;
	justify-content: flex-end;
`;

export const LoginButton = styled.Text`
	font-family: 'DINNextRoundedLTPro-Regular';
	font-size: 18px;
	background-color: #f2f2f2;
	border-radius: 8px;
	border-bottom-width: 2px;
	border-bottom-color: #808080;
	padding: 12px 20px;
	color: #be0029;
`;

export const Body = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

export const Phrase = styled.Text`
	font-family: 'DINNextRoundedLTPro-Regular';
	font-size: 28px;
	color: #f2f2f2;
	text-align: center;
`;