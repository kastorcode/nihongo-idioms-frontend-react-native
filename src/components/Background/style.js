import styled from 'styled-components/native';

export const SafeAreaView = styled.SafeAreaView`
	flex: 1;
	height: 100%;
	align-items: center;
	background-color: ${({theme}) => theme.background};
`;