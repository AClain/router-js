/** Class representing a Router. */
export class Router {
	rootElement = "";
	url = new URL("http://placeholder.io/");
	routes = [];
	parameters = [];

	/**
	 * Instanctiate a new Router.
	 */
	constructor() {
		this.url = new URL(window.location.href);
	}

	// Getters

	/**
	 * Get the current url.
	 * @return {URL} url - The current url as an URL object.
	 */
	getUrl = () => {
		console.log(typeof this.url);
		return this.url;
	};

	getRoutes = () => {
		return this.routes;
	};

	getParameters = () => {
		return this.parameters;
	};

	// Core functions
	/**
	 * Indicates the routes the router will try to match against the current url.
	 *
	 * @param {array} routes - Array or routes the router will test against the current url.
	 * @param {string} rootElement - A string compatible with querySelector, targeting the element in which HTML will be rendered.
	 */
	init = (routes, rootElement = "#root") => {
		this.rootElement = rootElement;
		try {
			document.querySelector(rootElement);
		} catch (e) {
			throw new Error("Specified root element could not be found in document.");
		}

		this.routes = routes;
	};

	match = (pathToMatch) => {
		if (pathToMatch[0] !== "/") {
			pathToMatch = "/" + pathToMatch;
		}

		let urlPathnames = this.url.pathname.split("/");
		let pathToMatchPathnames = pathToMatch.split("/");

		urlPathnames.shift();
		pathToMatchPathnames.shift();

		if (urlPathnames.length !== pathToMatchPathnames.length) {
			return false;
		}

		if (this.hasParameters(pathToMatchPathnames)) {
			return this.testParameters(urlPathnames, pathToMatchPathnames);
		}

		return this.testArrayEquals(urlPathnames, pathToMatchPathnames);
	};

	hasParameters = (pathnamesToMath) => {
		const has = (path) => path[0] === ":";

		return pathnamesToMath.some(has);
	};

	testParameters = (pathnames, pathnamesToMatch) => {
		for (let i = 0; i < pathnamesToMatch.length; i++) {
			if (pathnamesToMatch[i][0] !== ":") {
				continue;
			}

			this.parameters[pathnamesToMatch[i].substring(1)] = pathnames[i];
			pathnamesToMatch[i] = pathnames[i];
		}

		return this.testArrayEquals(pathnames, pathnamesToMatch);
	};

	testArrayEquals = (arr1, arr2) => {
		return (
			Array.isArray(arr1) &&
			Array.isArray(arr2) &&
			arr1.length === arr2.length &&
			arr1.every((val, index) => val === arr2[index])
		);
	};

	/**
	 * Runs the router and render the component matching the current route.
	 */
	run = async () => {
		let output = "404";

		for (let i = 0; i < this.routes.length; i++) {
			if (this.match(this.routes[i].path)) {
				output = this.routes[i].render;
				break;
			}
		}

		let path = "/src/pages/" + output + ".js";

		this.render(path);
	};

	/**
	 * Render the component from the given path to the DOM.
	 *
	 * @param {string} path - Path to the component to render.
	 */
	render = async (path) => {
		let component = await import(path);

		let html = component.default;

		const regexp = /(?<={)(.*?)(?=\})/g;
		const nbrOfOccurences = html.match(regexp);

		if (nbrOfOccurences !== null) {
			let match = "";

			while ((match = regexp.exec(html))) {
				if (typeof this.parameters[match[0]] === "undefined") {
					throw new Error("Query parameter " + match[0] + " is not defined");
				}
				html =
					html.substr(0, match.index - 1) + this.parameters[match[0]] + html.substr(regexp.lastIndex + 1, html.length);
			}
		}

		document.querySelector(this.rootElement).innerHTML += html;
	};
}
