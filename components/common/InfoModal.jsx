import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ListItem,
	UnorderedList,
	Text,
	Link,
	Divider,
} from "@chakra-ui/react";

export default function InfoModal({ onClose, isOpen }) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="3xl">
			<ModalOverlay />
			<ModalContent p="4">
				<ModalHeader>Cards against Humanity</ModalHeader>
				<Text color="gray">
					An unofficial online private* client for{" "}
					<Link color="teal" href="https://cardsagainsthumanity.com/">
						Cards against Humanity
					</Link>{" "}
					made by{" "}
					<Link color="teal" href="https://github.com/abhijit-hota">
						this guy
					</Link>
					. If you don&apos;t know how to play, then here are the rules for that wrinkleless brain of yours:
				</Text>
				<Divider mt="4" mb="4" />
				<UnorderedList spacing="4">
					<ListItem>
						There&apos;s a black card that you&apos;ll see that contains a question or a &quot;fill in the
						blanks&quot;. It might remind you of your school if you went to one.
					</ListItem>
					<ListItem>
						You have a bunch of white cards at the bottom. Find out the funniest card and play it.{" "}
					</ListItem>
					<ListItem>
						Each round has a <strong>Czar</strong>. The Czar chooses the funniest card out of the played
						cards. <strong>The Czar of that round can&apos;t play a white card.</strong>
					</ListItem>
					<ListItem>
						The one&apos;s card the Czar choses, gets a few points, that, I&apos;m sure would be more
						valuable to some than any of their achievements.
					</ListItem>
					<ListItem>
						The Czar changes and let&apos;s say you&apos;re the Czar now. Congrats for your newly found
						self-worth! The game continues.
					</ListItem>
				</UnorderedList>
				<Divider mt="4" mb="4" />
				<Text color="gray.500">
					*until someone guesses your room code.
					<br />
					<br />
					If you know working with{" "}
					<Link color="teal" href="https://firebase.google.com/products/realtime-database">
						Firebase RTDB
					</Link>{" "}
					or{" "}
					<Link color="teal" href="https://nextjs.org/">
						Next.js
					</Link>
					, help out a fellow smooth brain.
					<br />
					Here&apos;s the{" "}
					<Link color="teal" href="https://github.com/abhijit-hota/pcahc">
						GitHub Repo
					</Link>
					.
				</Text>
				<ModalCloseButton />
				<ModalBody></ModalBody>
			</ModalContent>
		</Modal>
	);
}
