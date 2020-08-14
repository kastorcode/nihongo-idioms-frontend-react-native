import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView`
	flex: 1;
	width: 100%;
	height: 100%;
	flex-basis: auto;
`;

export const View1 = styled.View`
	flex: 1;
	width: 100%;
	height: 100%;
	flex-basis: auto;
	align-items: center;
`;

export const View2 = styled.View`
	flex: 1;
	width: 96%;
	max-width: 800px;
	height: 100%;
	flex-basis: auto;
	padding-top: 32px;
	align-items: center;
	justify-content: ${({center}) => center ? 'center' : 'flex-start'};
`;