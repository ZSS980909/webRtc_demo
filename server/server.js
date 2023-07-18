// 使用WebSocket创建信令服务器（socket.io库）
console.log("start signaling server")
// Step 1: 创建WebSocket服务器，监听8010端口
const {Server} = require("socket.io");  // 集成有websocket协议的socket.io模块
const port = 8010;
// 建立WebSocket服务器，监听8010端口
const io = new Server({
	cors: true
}).listen(port, async () => {
	console.log("Start Signaling Server on *:8010");
});

// 服务端与客户端在完全建立WebSocket连接后才被触发，绑定connect事件（socket创建连接事件）
// Fired upon a connection from client
io.on("connect", (socket)=> {
	console.log(socket)
	console.log("socket connect ID:" + socket.id);
	// 作为信令服务器，主要监听以下来自直播客户端和观看直播客户端的指令
	// 并转发给接收信息的客户端
	socket.on("_offer", (data) => {
		console.log("offer from client : " + JSON.stringify(data.mediaDescript));
		socket.broadcast.emit("offer", data.mediaDescript);
	});
	socket.on("_answer", (data) => {
		console.log("answer from client :" + JSON.stringify(data.mediaDescript));
		socket.broadcast.emit("answer", data.mediaDescript);
	});
});