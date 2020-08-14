import React from 'react';
import { withTheme } from 'styled-components';
import { View, ImageBackground, Layer, Text } from './style';

function CarouselImage({ source, text, theme }) {
	return (
		<View theme={theme}>
	    <ImageBackground source={source}>
	    	<Layer>
	      	<Text theme={theme}>{ text }</Text>
	      </Layer>
	    </ImageBackground>
	  </View>
	);
}

export default withTheme(CarouselImage);