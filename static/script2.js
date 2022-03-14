const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
let ctx=canvas.getContext("2d");


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}



async function main() {
  // Load the model.
  const model = await blazeface.load();

  // Pass in an image or video to the model. The model returns an array of
  // bounding boxes, probabilities, and landmarks, one for each detected face.

  const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
  const predictions = await model.estimateFaces(video, returnTensors);

  if (predictions.length > 0) {
    /*
    `predictions` is an array of objects describing each detected face, for example:

    [
      {
        topLeft: [232.28, 145.26],
        bottomRight: [449.75, 308.36],
        probability: [0.998],
        landmarks: [
          [295.13, 177.64], // right eye
          [382.32, 175.56], // left eye
          [341.18, 205.03], // nose
          [345.12, 250.61], // mouth
          [252.76, 211.37], // right ear
          [431.20, 204.93] // left ear
        ]
      }
    ]
    */

    for (let i = 0; i < predictions.length; i++) {
      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];

      // Render a rectangle over each detected face.
      ctx.fillRect(start[0], start[1], size[0], size[1]);
      //console.log(i+predictions[i]);
      var l,r=predictions[0].landmarks[1]
      //console.log(predictions[0].landmarks[3]);
      console.log(l+" "+r);
      if(l==0 || r==0)
      {
       alert("Warning");
      }
    }
  }
  //console.log("1. "+predictions[0].landmarks[3]);
  //console.log("2. "+predictions[1].landmarks[3]);
  //const a=predictions[0].landmarks[3];

}


startVideo();
setInterval(main,300);

