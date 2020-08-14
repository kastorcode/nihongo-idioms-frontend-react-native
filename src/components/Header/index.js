import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native';
import { withTheme } from 'styled-components';
import { Menu, MenuOptions, MenuTrigger, withMenuContext } from 'react-native-popup-menu';
import logo from '../../assets/images/logo-transparent.png';
import RightMenuText from '../RightMenuText';
import { Background, Container, Logo, Icon } from './style';

function Header({ ctx, theme }) {
	const navigation = useNavigation();

  function navigate(link) {
    navigation.navigate(link);
    ctx.menuActions.closeMenu();
  }

  const MenuOptionsStyle = {
    optionWrapper: {
      padding: 0
    }
  };

  return (
  	<Background theme={theme}>
  		<Container>
  			<TouchableWithoutFeedback
          onPress={navigation.openDrawer}
        >
  				<Icon name='bars' theme={theme} />
      	</TouchableWithoutFeedback>

  			<TouchableWithoutFeedback
          onPress={() => navigation.navigate('main')}
        >
          <Logo source={logo} />
        </TouchableWithoutFeedback>

        <Menu>
          <MenuTrigger><Icon name='ellipsis-v' theme={theme} /></MenuTrigger>
          <MenuOptions customStyles={MenuOptionsStyle}>
            <RightMenuText onPress={() => navigate('vocabulary')} theme={theme}>
              Vocabulário
            </RightMenuText>
            <RightMenuText onPress={() => navigate('shadowing')} theme={theme}>
              Shadowing
            </RightMenuText>
            <RightMenuText onPress={() => navigate('modules')} theme={theme}>
              Módulos
            </RightMenuText>
          </MenuOptions>
        </Menu>
	  	</Container>
	  </Background>
  );
}

export default withTheme(withMenuContext(Header));