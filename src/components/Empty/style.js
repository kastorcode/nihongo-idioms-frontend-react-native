import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const Icon = styled(FontAwesome5)`
	font-size: 32px;
	color: ${({theme}) => theme.placeholder};
`;