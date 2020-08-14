import styled from 'styled-components/native';

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal_plus_two};
	color: ${({theme}) => theme.text};
	align-self: flex-start;
	line-height: 32px;
`;