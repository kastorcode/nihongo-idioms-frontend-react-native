import styled from 'styled-components/native';
import ListContainer from '../../components/ListContainer';

export const ListContainerStyled = styled(ListContainer)`
	border-width: 2px;
	border-top-width: 0px;
	border-color: #808080;
	border-radius: 2px;
  box-shadow: ${({theme}) => theme.shadow} 1px 1px 4px;
  shadow-opacity: 0.4;
  margin-bottom: 20px;
`;