import "./index.css";

// 各種HTML要素を取得
const myVideo = document.getElementById("my-video") as HTMLVideoElement;
const otherVideo = document.getElementById("other-video") as HTMLVideoElement;

const sdpOutput = document.getElementById("sdp-output") as HTMLTextAreaElement;
const sdpInput = document.getElementById("sdp-input") as HTMLTextAreaElement;

const sdpCreateOfferButton = document.getElementById("sdp-create-offer-button") as HTMLButtonElement;
const sdpReceiveButton = document.getElementById("sdp-receive-button") as HTMLButtonElement;

const iceOutput = document.getElementById("ice-output") as HTMLTextAreaElement;
const iceInput = document.getElementById("ice-input") as HTMLTextAreaElement;

const iceReceiveButton = document.getElementById("ice-receive-button") as HTMLButtonElement;

// WebRTCのコネクションオブジェクトを作成
const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

// 自身のビデオストリームを取得
const myMediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 800,
    height: 600,
  },
});
myVideo.srcObject = myMediaStream;
// 自身のビデオストリームを設定
myMediaStream.getTracks().forEach((track) => peer.addTrack(track, myMediaStream));

// Offer SDPの作成処理
sdpCreateOfferButton.addEventListener("click", async () => {
  const sessionDescription = await peer.createOffer();
  await peer.setLocalDescription(sessionDescription);
  sdpOutput.value = JSON.stringify(sessionDescription, null, 2);
});

// SDPの受け取り処理
sdpReceiveButton.addEventListener("click", async () => {
  const sessionDescription: RTCSessionDescriptionInit = JSON.parse(sdpInput.value);
  await peer.setRemoteDescription(sessionDescription);

  // Offer SDPの場合はAnswer SDPを作成
  if (sessionDescription.type === "offer") {
    const sessionDescription = await peer.createAnswer();
    await peer.setLocalDescription(sessionDescription);
    sdpOutput.value = JSON.stringify(sessionDescription, null, 2);
  }
});

// 自身のICE Candidateの一覧
const iceCandidates: RTCIceCandidate[] = [];
// ICE Candidateが生成された時の処理
peer.addEventListener("icecandidate", (event) => {
  if (event.candidate === null) return;
  iceCandidates.push(event.candidate);

  iceOutput.value = JSON.stringify(iceCandidates, null, 2);
});

// ICE Candidateの受け取り処理
iceReceiveButton.addEventListener("click", async () => {
  const iceCandidates: RTCIceCandidateInit[] = JSON.parse(iceInput.value);
  for (const iceCandidate of iceCandidates) {
    await peer.addIceCandidate(iceCandidate);
  }
});

// Trackを取得した時の処理
peer.addEventListener("track", (event) => {
  otherVideo.srcObject = event.streams[0];
});
