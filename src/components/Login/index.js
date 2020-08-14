import React from 'react';
import { Container, Browser } from './style';

export default function Login() {
	const html = `
		<head>
			<meta name="google-signin-client_id" content="207077854831-ncqrvt9c2u9s6dmgm4ppfijbrchv4kj7.apps.googleusercontent.com" />
			<script src="https://apis.google.com/js/platform.js" async defer></script>
		</head>
		<body>
			<p>oi</p>
			<a href="#" class="g-signin2 button" data-onsuccess="onSignIn">Google Login</a>
			<div class="g-signin2" data-onsuccess="onSignIn">Google Login 2</div>
			<p>ola</p>
			<script>
				function onSignIn(googleUser) {
			    var profile = googleUser.getBasicProfile();
			    var googleToken = googleUser.getAuthResponse().id_token;
			    console.log(profile);
			    console.log(googleToken);
				}

        //window.ReactNativeWebView.postMessage("Hello22222222!");
      </script>
		</body>`;

  return (
  	<Container>
	    <Browser
	      source={{
	      	html,
	      	headers: {
      			'Origin': 'http://localhost',
      			'Host': 'http://localhost',
      			'Referer': 'http://localhost',
      			'X-FORWARDED': 'http://localhost',
      			'User-Agent': 'Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0'
    			}
	      }}
	      onMessage={event => {
	      	console.log(event);
        	alert(event.nativeEvent.data);
        }}
	    />
	  </Container>
  );
}