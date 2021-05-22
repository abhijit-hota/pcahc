import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "../common/header";

function App({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<Header />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
