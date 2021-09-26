export const routes = [
	{
		path: "/",
		render: "home",
	},
	{
		path: "/posts",
		render: "posts",
	},
	{
		path: "/contact",
		render: "contact",
	},
	{
		path: "/post/:id",
		render: "post",
	},
	{
		path: "/user/:id/posts",
		render: "user_posts",
	},
	{
		path: "/user/:user_id/post/:post_id",
		render: "user_post",
	},
];
