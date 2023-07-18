function askLive() {
	let btn = document.getElementById("startLiveBtn");
	// 和socket.on类似的，回调接受一个参数：一个基于 Event 的对象，
	// 用以描述已发生的事件，并且它不返回任何内容
	btn.addEventListener("click", () => {
		console.log("Clicked btn");
		// 本地socket发出requestLive消息，---> 注释
		// 在clientSocket.js中绑定了接收该消息的监听事件 ---> 注释
		// 实现了当点击按钮时，触发直播请求的指令给信令服务器
		// 并将携带有消息的JSON对象发送出去
		// socket.emit("requestLive", {
		// 	"type" : "requestLive"
		// });

		// 用户按下按钮，请求观看直播，开始建立视频流通路
		createPeerConn();
		// 主动发送offer指令并携有offer信息的对象
		sendOffer();
		// 当有来自对等端提供的视频流时，将音视频轨道添加到接收直播的客户端页面中
		peerConn.addEventListener("track", setVideo);
	});
}

// 播放提供直播的客户端发送过来的视频
function setVideo(data) {
	console.log(data.streams);
	document.getElementById("startLiveBtn");
	let video = document.getElementById("thetaVideo");
	video.srcObject = data.streams;
	// loadedmetadata事件在元数据（metadata）被加载完成后触发。
	video.onloadeddata = () => {
		// 接收到元数据后直接播放
		video.play();
	};
}