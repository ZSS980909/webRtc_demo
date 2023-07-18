// 观看直播的客户端代码
let socket; // 为socket声明全局变量，其他js文件也用
let peerConn; // 定义客户端连接对象
window.onload = () => {
	initSocket();
	askLive();
}

// 信令服务器，本质就是中介，帮助P2P的对等端建立连接
// 负责媒体协商消息的传递，Ice候选人的传递，更多的如房间管理等功能
function initSocket() {
	// http/ws请求均可
	socket = io("ws://127.0.0.1:8010");
	// 作为接收直播视频的客户端，通过socket主要监听信令服务器的以下指令
	// socket.on("requestLive", requestLiveHandler); // 点击按钮，向视频服务端申请观看直播
	socket.on("offer", getOffer); // 通过信令服务器从视频服务端接收offer
	socket.on("answer", getAnswer); // 通过信令服务器从视频服务器接收answer
}

// 注意socket.on(event, enventHandler(data, fn) {
// 	event： 参数值为一个用于指定事件名的字符串，如"connect"
// 	function： 当监听到该事件的时候执行的方法
// 	data： 该事件传过来的data参数，可以是字符串，也可以是对象
// })