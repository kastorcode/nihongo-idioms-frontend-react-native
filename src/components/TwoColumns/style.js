import styled from 'styled-components/native';

export const View = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 20px;
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.bold};
	font-size: ${({theme}) => theme.font.normal_plus_two};
	color: ${({theme}) => theme.text};
`;