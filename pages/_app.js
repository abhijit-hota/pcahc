import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "../common/header";
import Head from "next/head";

function App({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<Head>
				<title>Cards against Humanity</title>
				<meta name="description" content="A Private CAH client" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
