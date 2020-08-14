import styled from 'styled-components/native';

export const StyledText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	text-align: justify;
	line-height: 32px;
`;