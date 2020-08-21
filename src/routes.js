import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import * as Analytics from 'expo-firebase-analytics';
import { deepLink } from './config';
import useAdBlocker from './hooks/useAdBlocker';
import { MenuHeader, UserName, UserCourse, MenuBody, MenuIcon } from './components/Header/style';
import { HeaderLeftIcon } from './styles/global';
import Home from './pages/Home';
import AdBlock from './pages/AdBlock';
import UserMain from './pages/UserMain';
import Vocabulary from './pages/Vocabulary';
import Phrases from './pages/Phrases';
import AddPhrase from './pages/AddPhrase';
import MyPhrases from './pages/MyPhrases';
import SearchPhrases from './pages/SearchPhrases';
import Dictionary from './pages/Dictionary';
import Modules from './pages/Modules';
import Module from './pages/Module';
import Shadowing from './pages/Shadowing';
import ShadowingText from './pages/ShadowingText';
import Forum from './pages/Forum';
import ForumQuestion from './pages/ForumQuestion';
import AddQuestion from './pages/AddQuestion';
import Notifications from './pages/Notifications';
import Notification from './pages/Notification';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import Tutorial from './pages/Tutorial';
import Logout from './pages/Logout';
import Offline from './pages/Offline';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const menu = [ ['Vocabulário', 'brain', 'vocabulary'],
               ['Módulos', 'book', 'modules'],
               ['Shadowing', 'file-audio', 'shadowing'],
               ['Fórum', 'forumbee', 'forum'],
               ['Notificações', 'bell', 'notifications'],
               ['Configurações', 'cog', 'settings'],
               ['Premium', 'smile', 'premium'],
               ['Sair', 'sign-out-alt', 'logout'] ];

function StackNavigator(props) {
  const { theme } = props.route.params;

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: theme.header.bg,
        elevation: 0
      },
      headerTintColor: theme.header.text,
      headerTitleStyle: {
        fontFamily: theme.font.bold,
        fontSize: 18
      },
      headerPressColorAndroid: '#ff0c40',
      headerLeft: props => (
        <TouchableOpacity activeOpacity={0.6} {...props}>
          <HeaderLeftIcon name='arrow-left' theme={theme} />
        </TouchableOpacity>
      )
    }}>
      { props.children }
    </Stack.Navigator>
  );
}

function VocabularyScreen(props) {
  return(
    <StackNavigator {...props}>
      <Stack.Screen name="vocabulary" component={Vocabulary} />
      <Stack.Screen
        name="phrases"
        component={Phrases}
        options={{
          headerShown: true,
          title: 'Revisão'
        }}
      />
      <Stack.Screen
        name="addphrase"
        component={AddPhrase}
        options={{
          headerShown: true,
          title: 'Acrescentar ao meu vocabulário'
        }}
      />
      <Stack.Screen
        name="myphrases"
        component={MyPhrases}
        options={{
          headerShown: true,
          title: 'Minhas frases'
        }}
      />
      <Stack.Screen
        name="searchphrases"
        component={SearchPhrases}
        options={{
          headerShown: true,
          title: 'Buscar frases'
        }}
      />
      <Stack.Screen
        name="dictionary"
        component={Dictionary}
        options={{
          headerShown: true,
          title: 'Dicionário'
        }}
      />
    </StackNavigator>
  );
}

function ModulesScreen(props) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name='modules' component={Modules} />
      <Stack.Screen
        name="module"
        component={Module}
        options={{
          headerShown: true,
          title: ''
        }}
      />
    </StackNavigator>
  );
}

function ShadowingScreen(props) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name='shadowing' component={Shadowing} />
       <Stack.Screen
        name="shadowingtext"
        component={ShadowingText}
        options={{
          headerShown: true,
          title: ''
        }}
      />
      <Stack.Screen
        name="dictionary"
        component={Dictionary}
        options={{
          headerShown: true,
          title: 'Dicionário'
        }}
      />
    </StackNavigator>
  );
}

function ForumScreen(props) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name='forum' component={Forum} />
      <Stack.Screen
        name='forumquestion'
        component={ForumQuestion}
        options={{
          headerShown: true,
          title: 'Fórum'
        }}
      />
      <Stack.Screen
        name='addquestion'
        component={AddQuestion}
        options={{
          headerShown: true,
          title: 'Adicionar pergunta'
        }}
      />
    </StackNavigator>
  );
}

function NotificationsScreen(props) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name='notifications' component={Notifications} />
      <Stack.Screen
        name='notification'
        component={Notification}
        options={{
          headerShown: true,
          title: 'Notificação'
        }}
      />
    </StackNavigator>
  );
}

function drawerContent(props, theme, name, course) {
  const { navigate, closeDrawer } = props.navigation;

  return (
    <DrawerContentScrollView {...props}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-around'
      }}
    >
      <MenuHeader>
        <UserName theme={theme}>
          {name}
        </UserName>
        <UserCourse theme={theme}>
          {course.full.toUpperCase()}
        </UserCourse>
      </MenuHeader>
      <MenuBody>
        { menu.map((item) => (
          <DrawerItem
            key={item[2]}
            label={item[0]}
            icon={() => <MenuIcon name={item[1]} theme={theme} />}
            onPress={() => {
              navigate(item[2]);
              closeDrawer();
            }}
            activeTintColor={theme.header.menu.text}
            activeBackgroundColor='#ff0c40'
            inactiveTintColor={theme.header.menu.text}
            labelStyle={{
              fontFamily: theme.font.regular,
              fontSize: 18
            }}
            style={{
              marginHorizontal: 0,
              marginVertical: 4,
              paddingVertical: 4,
              borderRadius: 0
            }}
          />
        )) }
      </MenuBody>
    </DrawerContentScrollView>
  );
}

function Routes({ theme }) {
  const {
    online,
    auth: { logged, premium },
    user: { course, name }
  } = useSelector(store => store);

  const navigationRef = useRef();
  const routeNameRef = useRef();
  const blocked = useAdBlocker();
  const linking = {
    prefixes: [deepLink]
  };

  function onStateChange() {
    const currentRouteName = navigationRef.current.getCurrentRoute().name;

    if (currentRouteName != routeNameRef.current) {
      Analytics.setCurrentScreen(currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  }

  if (name && logged) {
    if (blocked) {
      return (
        <NavigationContainer ref={navigationRef}>
          <Drawer.Navigator
            initialRouteName='adblock'
            unmountInactiveRoutes={true}
            drawerStyle={{ width:0, height:0 }}
          >
            <Drawer.Screen name={'adblock'} component={AdBlock} />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    }
    else if (!premium && !online) {
      return (
        <NavigationContainer ref={navigationRef}>
          <Drawer.Navigator
            drawerStyle={{ width:0, height:0 }}
            unmountInactiveRoutes={true}
            initialRouteName='offline'
          >
            <Drawer.Screen name={'offline'} component={Offline} />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    }
    else {
      return (
        <NavigationContainer linking={linking} ref={navigationRef} onStateChange={onStateChange}>
          <Drawer.Navigator
            initialRouteName='main'
            backBehavior='history'
            drawerType='front'
            overlayColor={0}
            drawerContent={(props) => drawerContent(props, theme, name, course)}
            drawerStyle={{
              maxWidth: 220,
              backgroundColor: theme.header.menu.bg,
              shadowColor: theme.shadow,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4
            }}
          >
            <Drawer.Screen name={'main'} component={UserMain} />
            <Drawer.Screen name={'vocabulary'} component={VocabularyScreen} initialParams={{theme:theme}} />
            <Drawer.Screen name={'modules'} component={ModulesScreen} initialParams={{theme:theme}} />
            <Drawer.Screen name={'shadowing'} component={ShadowingScreen} initialParams={{theme:theme}} />
            <Drawer.Screen name={'forum'} component={ForumScreen} initialParams={{theme:theme}} />
            <Drawer.Screen name={'notifications'} component={NotificationsScreen} initialParams={{theme:theme}} />
            <Drawer.Screen name={'settings'} component={Settings} />
            <Drawer.Screen name={'premium'} component={Premium} />
            <Drawer.Screen name={'tutorial'} component={Tutorial} />
            <Drawer.Screen name={'logout'} component={Logout} />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    }
  }
  else {
    return (
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          initialRouteName='home'
          backBehavior='initialRoute'
          unmountInactiveRoutes={true}
          drawerStyle={{ width:0, height:0 }}
        >
          <Drawer.Screen name={'home'} component={Home} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

export default withTheme(Routes);