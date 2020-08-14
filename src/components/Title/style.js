import styled from 'styled-components/native';

export const View = styled.View`
	width: 100%;
	margin-bottom: 32px;
`;

export const Text = styled.Text`
	display: flex;
	justify-content: center;
	text-align: center;
	font-family: ${({theme}) => theme.font.bold};
	font-size: ${({theme}) => theme.font.big};
	color: ${({theme}) => theme.text};
`;