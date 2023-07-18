// 提供视频的客户端代码
let socket = false; // 为socket声明全局变量，其他js文件也用
let peerConn = false; // 定义客户端连接对象
let mediaStream = false; // 定义一个用于存储theta视频流的对象
initSocket();
startLive();


// 信令服务器，本质就是中介，帮助P2P的对等端建立连接
// 负责媒体协商消息的传递，Ice候选人的传递，更多的如房间管理等功能
function initSocket() {
	// http/ws请求均可
	socket = io("ws://127.0.0.1:8010");
	// 作为提供视频的客户端，通过socket主要监听信令服务器的以下指令
	socket.on("offer", getOffer); // 通过信令服务器从服务端接收offer
	socket.on("answer", getAnswer); // 通过信令服务器从服务器接收answer
}

async function startLive() {
	await createMediaStream();
	// peerConnection.js功能，直播流正常读取完成后
	// 开始进行SDP和ICE交换
	await createPeerConn();
	//将本地视频流流附属至peer中
	window.onload = () => {
		mediaStream.getTracks().forEach(async track => {
			await peerConn.addTrack(track, mediaStream); 
		});
	}
	
}

