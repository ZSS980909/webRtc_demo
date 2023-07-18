// 带_的offer和_answer表示先发送给服务器，通过服务器再传输给对等端
async function createPeerConn() {
	if (!peerConn) {
		peerConn = new RTCPeerConnection({offerToReceiveAudio: true});
	}
	// 从调用setLocalDescription后开始，
	// 每次 WebRTC 找到/收集一个可用的 Candidate，
	// 都会触发一次icecandidate事件
	// 为了将收集到的 Candidate 交换给对端，需要给onicecandidate方法设置一个回调函数
	// 函数里面调用addIceCandidate方法（或者onincecandidate）来将候选者添加到通信中
	// 将收集到的candidate发送给服务器，并传递给p2p连接的对方（客户端
	peerConn.addEventListener("icecandidate", sendIce);
	// 需要协商事件 既发生在连接的初始设置期间
	// 也发生在通信环境发生变化需要重新配置连接的任何时候
	peerConn.addEventListener("negotiationneeded", sendOffer);
}

// 媒体协商
// 同步发送offer到信令服务器，并将offer的SDP传递给对方
async function sendOffer() {
	let offer = await peerConn.createOffer();
	await peerConn.setLocalDescription(offer); // 附属本地offer
	console.log("send offer :" + JSON.stringify(offer))
	// 发送的消息以json对象形式
	// JSON 对象使用在大括号 {...} 中书写。对象可以包含多个 key/value（键/值）对。
	// key 必须是字符串，value 可以是合法的 JSON 数据类型（字符串, 数字, 对象, 数组, 布尔值或 null）。
	// key 和 value 中使用冒号 : 分割。
  // 每个 key/value 对使用逗号 , 分割。
	socket.emit("_offer", {
		// 将本地媒体描述使用socket.emit发送给信令服务器
		mediaDescript: offer
	})
}

// 接收offer，并保存远程描述后，返回给对方answer
async function getOffer(data) {
	if(!peerConn) return; // 等待对方响应
	console.log("get offer :" + JSON.stringify(data));
	await peerConn.setRemoteDescription(data); // 附属远程offer
	// 回复answer
	await sendAnswer();
}

async function sendAnswer() {
	let answer = await peerConn.createAnswer();
	console.log("send answer :" + JSON.stringify(answer));
	await peerConn.setLocalDescription(answer); // 附属本地answer
	// 发送本地answer给信令服务器
	socket.emit("_answer", {
		mediaDescript: answer
	});
}

async function getAnswer(data) {
	console.log("get answer :" + JSON.stringify(data));
	// 接收到远端answer后peer附属远程answeer描述
	await peerConn.setRemoteDescription(data);
	console.log("iceGatheringState :" + peerConn.iceGatheringState);
}

// 在setLocalDescription触发时，会收集本地ICE信息（ip，端口，协议等）并发送给对方
function sendIce(event) {
	if (event.candidate) {
		console.log("send candidate :" + JSON.stringify(event.candidate));
		socket.emit("_ice", {
			candidateDescript : event.candidate
		})
	}
	
}

// 获取对方的 ice，并将ice添加到peerConnection中
async function getIce(data) {
	if (!peerConn) return; // 等待对方响应
	console.log("get ice :" + JSON.stringify(data));
	// 根据对方的 candidate 信息，创建 RTCIceCandidate实例对象
	let candidate = new RTCIceCandidate(data);
	await peerConn.addIceCandidate(candidate);
}