import React from 'react';
import { withTheme } from 'styled-components';
import Container from '../Container';
import { Icon } from './style';

function Empty({ theme }) {
	return (
		<Container center={true}>
			<Icon name='inbox' theme={theme} />
		</Container>
	);
}

export default withTheme(Empty);