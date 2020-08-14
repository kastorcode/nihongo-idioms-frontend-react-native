import styled from 'styled-components/native';

export const View = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px;
	margin-bottom: 24px;
	background-color: ${({theme}) => theme.bar.bg};
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.bar.color};
`;