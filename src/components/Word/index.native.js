import React from 'react';
import { withTheme } from 'styled-components';
import { Pressable, Text } from 'react-native';

function Word({ children, onPress, theme }) {
	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<Text style={{
					color: pressed ? theme.word.active : theme.word.color,
				  fontFamily: theme.font.regular,
					fontSize: 24,
					marginRight: 5
				}}>
					{ children }
				</Text>
      )}
		</Pressable>
	);
}

export default withTheme(Word);