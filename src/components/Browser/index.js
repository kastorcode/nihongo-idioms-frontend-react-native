import React from 'react';
import { Container, Browser } from './style';

export default function BrowserLightbox({ uri }) {
  return (
  	<Container>
	    <Browser
	    	source={{ uri:uri }}
	    />
	  </Container>
  );
}