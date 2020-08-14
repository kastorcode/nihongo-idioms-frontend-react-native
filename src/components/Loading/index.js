import React from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { withTheme } from 'styled-components';
import Container from '../Container';

function Loading({ theme }) {
	return (
		<Container center={true}>
			<TouchableWithoutFeedback onPress={() => alert('Carregando...')}>
				<Image
					style={{
						width: 47,
						height: 47,
						padding: 20
					}}
					source={theme.loading}
				/>
			</TouchableWithoutFeedback>
		</Container>
	);
}

export default withTheme(Loading);