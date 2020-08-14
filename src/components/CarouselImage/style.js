import styled from 'styled-components/native';

export const View = styled.View`
	width: 100%;
	height: 100%;
	min-height: 254px;
	max-height: 266px;
	background-color: ${({theme}) => theme.text};
	margin-bottom: 28px;
`;

export const ImageBackground = styled.ImageBackground`
	width: 100%;
	height: 100%;
`;

export const Layer = styled.View`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.6);
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.big};
	color: ${({theme}) => theme.header.text};
	text-align: center;
	padding: 0px 16px;
`;