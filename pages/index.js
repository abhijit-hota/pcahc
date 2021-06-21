import { useState } from "react";
import { useRouter } from "next/router";

import {
	Box,
	Button,
	Container,
	Input,
	VStack,
	Divider,
	AspectRatio,
	useColorModeValue,
	Heading,
	InputGroup,
	InputRightAddon,
	Text,
} from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { CAH_PLAYER_ID, CAH_ROOM_CODE } from "../utils/tokenNames";
import api from "../utils/api";
import { auth } from "../utils/auth";

const NAME_RE = /^[\w\d\s]{1,12}$/;
const CODE_RE = /^[A-Z]{6}$/;

const signIn = async () => {
	const signedIn = await auth.signInAnonymously();
	return { userID: signedIn.user.uid };
};

export default function Home() {
	const [username, setUsername] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [loading, setLoading] = useState({ joining: false, creating: false });
	const [isRoomCodeInvalid, setIsRoomCodeInvalid] = useState(false);
	const [isNameInvalid, setIsNameInvalid] = useState(false);

	const { boxBg, avatarPlaceholder } = useColorModeValue(
		{ boxBg: "#fefefe", avatarPlaceholder: "#222222" },
		{ boxBg: "#222222", avatarPlaceholder: "#fefefe" }
	);
	const router = useRouter();

	const handleSuccess = async (id, code = roomCode) => {
		sessionStorage.setItem(CAH_ROOM_CODE, code);
		sessionStorage.setItem(CAH_PLAYER_ID, id);
		router.push(`/game/${code}`);
	};
	const handleRoomCreate = async () => {
		const isNameInvalid = !NAME_RE.test(username);
		if (isNameInvalid) {
			setIsNameInvalid(isNameInvalid);
			return false;
		}
		setLoading({ joining: false, creating: true });
		try {
			const { userID } = await signIn();
			const { roomCode } = await api.post("/create-room", {
				username,
				userID,
			});
			await auth.currentUser.getIdToken(true);
			handleSuccess(userID, roomCode);
		} catch (error) {
			//todo: show error toast
			console.log(error);
		}
		setLoading({ joining: false, creating: false });
	};
	const handleRoomJoin = async (code = roomCode) => {
		const isNameInvalid = !NAME_RE.test(username);
		const isCodeInvalid = !CODE_RE.test(code);
		console.log(isCodeInvalid, code);
		if (isCodeInvalid || isNameInvalid) {
			setIsRoomCodeInvalid(isCodeInvalid);
			setIsNameInvalid(isNameInvalid);
			return false;
		}

		setLoading({ joining: true, creating: false });
		try {
			const { userID } = await signIn();
			await api.post("/join-room", {
				username,
				userID,
				roomCode: code,
			});
			await auth.currentUser.getIdToken(true);
			handleSuccess(userID, code);
		} catch (err) {
			console.log(err);
			setIsRoomCodeInvalid(true);
		}
		setLoading({ joining: false, creating: false });
	};
	return (
		<Container centerContent pt="12">
			<Box shadow="2xl" p="4" rounded="lg" bg={boxBg} maxW="md" minW="sm">
				<VStack>
					<AspectRatio ratio={1 / 1} w="32" m="6">
						{username === "" ? (
							<Box w="32" h="32" bg={avatarPlaceholder} color={boxBg} rounded="full">
								<Heading>CAH</Heading>
							</Box>
						) : (
							<Avatar
								name={username}
								variant="bauhaus"
								size="8rem"
								colors={["#ecd078", "#d95b43", "#c02942", "#542437", "#53777a"]}
							/>
						)}
					</AspectRatio>
					<Input
						size="lg"
						name="name"
						placeholder="Enter username"
						value={username}
						onChange={({ target: { value } }) => {
							if (isNameInvalid) {
								setIsNameInvalid(false);
							}
							setUsername(value);
						}}
						isInvalid={isNameInvalid}
					/>

					{isNameInvalid && (
						<Text color="red.300" alignSelf="flex-start">
							Type a name ffs (12 characters max)
						</Text>
					)}
					<Divider sx={{ margin: "1rem 0 1rem 0 !important" }} />
					{!router.query.join && !CODE_RE.test(router.query.join) ? (
						<>
							<InputGroup size="lg" w="full" sx={{ margin: "0 !important" }}>
								<Input
									borderRight="none"
									size="lg"
									placeholder="Room code"
									value={roomCode}
									onChange={({ target: { value } }) => {
										if (isRoomCodeInvalid) {
											setIsRoomCodeInvalid(false);
										}
										console.log(value, roomCode);
										setRoomCode(value.toUpperCase());
									}}
									isInvalid={isRoomCodeInvalid}
									onKeyDown={({ key }) => {
										if (key === "Enter") {
											handleRoomJoin();
										}
									}}
								/>
								<InputRightAddon p="0" border="none">
									<Button
										variant="ghost"
										size="lg"
										w="full"
										borderLeftRadius="none"
										onClick={() => handleRoomJoin(roomCode)}
										isLoading={loading.joining}
									>
										Join Room
									</Button>
								</InputRightAddon>
							</InputGroup>
							{isRoomCodeInvalid && (
								<Text color="red.300" alignSelf="flex-start">
									Where&apos;d you get that code from, dumbass?
								</Text>
							)}
							<Heading fontWeight="thin" size="md" p="3">
								OR
							</Heading>
							<Button
								w="full"
								size="lg"
								type="submit"
								isLoading={loading.creating}
								variant="solid"
								onClick={handleRoomCreate}
							>
								Create Room
							</Button>
						</>
					) : (
						<Button
							size="lg"
							w="full"
							onClick={() => handleRoomJoin(router.query.join)}
							isLoading={loading.joining}
						>
							Join Room
						</Button>
					)}
				</VStack>
			</Box>
		</Container>
	);
}
