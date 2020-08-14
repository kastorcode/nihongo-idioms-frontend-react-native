import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const Icon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.header.icons};
	padding: 20px;
`;