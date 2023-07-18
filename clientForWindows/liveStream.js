// 提供直播流的客户端特有的生成并发送视频流功能

// 获取theta摄像头和麦克风权限，并获取视频流
async function createMediaStream() {
	if (!mediaStream) {
		// getUserMedia异步操作，用await实现同步执行
		mediaStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		})// then里处理正常情况，执行handleSuccess函数
		.then(handleSuccess)
		// catch捕捉异常
		.catch(handleError);
	}
}

// 处理成功打开摄像头
function handleSuccess(stream) {
	// 获取视频播放的控件
	const video = document.getElementById("thetaVideo");
	video.srcObject = stream;
	video.onloadedmetadata = function (e) {
		video.play();
	};
	console.log("theta stream:" + stream);
}

// 处理未成功打开摄像头
function handleError(error) {
	console.log("Open camera failed: " + error.name);
}