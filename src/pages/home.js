import { Router } from "../router.js";

let router = new Router();

const Home = `
	<div id="main">
		<zero-md src="/README.md">
			<template>
			<link rel="stylesheet" href="/public/assets/styles/main.css">
		</template>
		</zero-md>
	</div>
	
`;

export default Home;
