import React from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { Menu, MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';
import { MenuStyle, MenuTitle, MenuTriggerStyles, MenuOptionsStyles } from './style';

function MenuPopover({ title, text, data, onSelect, theme, onOpen }) {
	return (
		<Menu renderer={renderers.Popover} style={MenuStyle(theme)} onOpen={onOpen}>
  		<MenuTitle theme={theme}>{ title }</MenuTitle>
    	<MenuTrigger customStyles={MenuTriggerStyles(theme)} text={ text } />
      <MenuOptions customStyles={MenuOptionsStyles(theme)}>
      	<FlatList
	        data={data}
	        keyExtractor={item => item.short}
	        renderItem={({item}) => (
	        	<MenuOption onSelect={() => onSelect(item)} text={item.full} />
	        )}
	      />
      </MenuOptions>
    </Menu>
	);
}

export default withTheme(MenuPopover);