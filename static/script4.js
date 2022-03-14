const video = document.getElementById('video');

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/static/models')
]).then(startVideo);


function startVideo() {
  navigator.getUserMedia(
    { video: {width : 400,height : 300} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );
}

async function start() {

  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  console.log("Hi2");
  let canvas;
    canvas = faceapi.createCanvasFromMedia(video);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
    results.forEach((result, i) => {
    const box = resizedDetections[i].detection.box;
    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
    drawBox.draw(canvas);
    })
}

function loadLabeledImages() {
  console.log("Hi1");
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/path/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}


video.addEventListener("loadeddata", async () => {

setInterval(start,5000);


});

