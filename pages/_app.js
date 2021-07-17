import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "components/common/Header";
import Head from "next/head";
import { theme } from "frontend-utils/ui";

function App({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<Head>
				<title>Cards against Humanity</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Header />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
