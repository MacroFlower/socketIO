const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;
const path = require("path");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.post("/newroom", jsonParser, (req, res) => {
	const room = req.body.room;
	const color = req.body.color;
	app.get("/" + room, (req, res) => {
		res.render(__dirname + "/room.ejs", { room: room, color: color });
	});
	res.send({
		room: room,
		color: color,
	});
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const admin = io.of("/admin");

app.use(express.static("."));

admin.on("connection", (socket) => {
	socket.on("join", (data) => {
		socket.join(data.room);
		admin.in(data.room).emit("chat message", `New user joined ${data.room}!`);
	});

	socket.on("chat message", (data) => {
		admin.in(data.room).emit("chat message", data.msg);
	});

	socket.on("disconnect", () => {
		admin.emit("chat message", "user disconnected");
	});
});
app.get("/room1", (req, res) => {
	res.render(__dirname + "/room.ejs", { room: "room1" });
});

app.get("/room2", (req, res) => {
	res.render(__dirname + "/room.ejs", { room: "room2" });
});

// instead of render, sendFile:
/* app.get("/room1", (req, res) => {
	res.sendFile(__dirname + "/room1.html");
});

app.get("/room2", (req, res) => {
	res.sendFile(__dirname + "/room2.html");
}); */
//the "random" rooms:
app.get("/", (req, res) => {
	Math.random() < 2
		? res.sendFile(__dirname + "/index.html")
		: res.sendFile(__dirname + "/second.html");
});

server.listen(PORT, () => {
	console.log(`Listening on *: ${PORT}`);
});
//earlier code stuff:
/* admin.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		admin.emit("chat message", msg);
	});
}); */
//local console.log in terminal:
/* admin.on("connection", (socket) => {
	console.log("a user connected");
	console.log("Id: " + socket.id);
}); */

/* io.on("connection", (socket) => {
	socket.emit("server message", { server: "any messages for me?" });
	socket.on("chat message", (msg) => {
		console.log("message: " + msg);
	});
}); */

//for the chat and chat2:
/* io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
});
io.on("connection", (socket) => {
	socket.on("chat2 message", (msg) => {
		io.emit("chat2 message", msg);
	});
}); */
