import styled from 'styled-components/native';

export const View = styled.View`
	flex: 1;
	width: 96%;
	max-width: 800px;
	height: 100%;
	margin: 32px 0;
	align-self: center;
	align-items: center;
	justify-content: ${({center}) => center ? 'center' : 'flex-start'};
`;