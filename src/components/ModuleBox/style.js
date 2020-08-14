import styled from 'styled-components/native';

export const View = styled.View`
	background-color: ${({theme}) => theme.bar.bg};
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.bar.color};
	padding: 14px;
`;