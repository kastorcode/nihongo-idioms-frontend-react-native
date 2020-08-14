import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';

export const Container = styled.View`
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.6);
	z-index: 8;
`;

export const Browser = styled(WebView)`
	width: 96%;
	max-width: 400px;
	height: 96%;
	max-height: 400px;
	margin: auto;
	background-color: #fff;
	border-radius: 8px;
	z-index: 9;
`;