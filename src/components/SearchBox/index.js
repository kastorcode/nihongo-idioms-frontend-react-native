import React from 'react';
import { withTheme } from 'styled-components';
import ClickAnimation from '../ClickAnimation';
import { View, TextInput, Button } from './style';

function SearchBox({ theme, onChangeText, onSubmitEditing, loading, style, keyboardType='default', maxLength=100, placeholder='', value='', text='Procurar' }) {
	return (
		<View style={style}>
			<TextInput
	      theme={theme}
	      placeholder={placeholder}
	      placeholderTextColor={theme.placeholder}
	      maxLength={maxLength}
	      value={value}
	      onChangeText={onChangeText}
	      onSubmitEditing={onSubmitEditing}
	      keyboardType={keyboardType}
	      returnKeyType='send'
   	 />
    	<ClickAnimation
    		loading={loading}
    		onPress={onSubmitEditing}
    	>
    		<Button theme={theme}>{ text }</Button>
    	</ClickAnimation>
		</View>
	);
}

export default withTheme(SearchBox);