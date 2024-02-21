import express, { Request, Response } from "express";
import Mustache from "mustache";
import { readFile } from "fs/promises";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const comments: { author: string; comment: string }[] = [];

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true,
	}),
);

app.get("/", async (req: Request, res: Response) => {
	const [layoutTpl, blogTpl, newCommentTpl, commentsTpl] = await Promise.all([
		readFile("partials/layout.mustache", { encoding: "utf8" }),
		readFile("partials/blog.mustache", { encoding: "utf8" }),
		readFile("partials/new-comment.mustache", { encoding: "utf8" }),
		readFile("partials/comments.mustache", { encoding: "utf8" }),
	]);
	const body = Mustache.render(blogTpl, {
		content: "contents here",
		newComment: newCommentTpl,
		comments: Mustache.render(commentsTpl, {
			comments,
		}),
	});
	const page = Mustache.render(layoutTpl, {
		body,
	});
	res.send(page);
});

app.post("/blog/new-comment", async (req: Request, res: Response) => {
	const author = req.body.author;
	const comment = req.body.comment;
	comments.push({
		author,
		comment,
	});
	const [newCommentTpl] = await Promise.all([
		readFile("partials/new-comment.mustache", { encoding: "utf8" }),
	]);
	res.send(newCommentTpl);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
