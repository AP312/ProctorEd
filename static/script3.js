const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
let ctx=canvas.getContext("2d");


const startVideo = () => {
  navigator.mediaDevices.getUserMedia(
    { video: {width: 400,height: 300} },
  )
  .then((stream) => {
    video.srcObject =stream;
  });
};



const main = async () => {
  // Load the model.


  // Pass in an image or video to the model. The model returns an array of
  // bounding boxes, probabilities, and landmarks, one for each detected face.

  const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
  const predictions = await model.estimateFaces(video, returnTensors);
  ctx.drawImage(video,0,0,400,300);

  if (predictions.length > 0) {

  //console.log(predictions[0].landmarks[3]);
  predictions.forEach((pred) =>{
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle="blue";
      ctx.rect(
           pred.topLeft[0],
           pred.topLeft[1],
           pred.bottomRight[0]-pred.topLeft[0],
           pred.bottomRight[1]-pred.topLeft[1]
      );
      ctx.stroke();
      ctx.fillStyle="red";

      pred.landmarks.forEach(landmark => {

        ctx.fillRect(landmark[0],landmark[1],5,5);

      })

  });

   if(predictions.length>1)
   {
      var x=document.getElementById("warn").innerHTML;
      document.getElementById("warn").innerHTML=parseInt(x)+1;
      if(document.getElementById("warn").innerHTML>10)
      {
         window.location.assign("http://127.0.0.1:8000/");
      }
      alert("Warning : More than 1 face detected");
   }

  }
  else
  {
    alert("Warning : No participant detected");
    window.location.assign("http://127.0.0.1:8000/");
  }




};


const main1 = async () => {

const predictions1 = await model1.detect(video);
//console.log('Predictions1 :');
//console.log(predictions1);

  predictions1.forEach((pred1) =>{

      const [x,y,width,height] = pred1['bbox'];
      const text = pred1['class'];

      const color = 'green';
      ctx.strokeStyle=color;
      ctx.font='18px Arial';
      ctx.fillStyle=color;

      ctx.beginPath();
      ctx.fillText(text,x,y);
      ctx.rect(x,y,width,height);
      ctx.stroke();

  });


  predictions1.forEach((pred1) =>{

      if(pred1['class'].toLocaleLowerCase().localeCompare("cell phone")==0)
      {
         alert("Warning : Mobile phone detected");
         window.location.assign("http://127.0.0.1:8000/");
      }

  });





};


const main2 = async () => {


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var words = ['answer','question','discord' ];
var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

/**document.body.onclick = function() {
  recognition.start();
  console.log('Begin...');
}**/

  recognition.start();
  console.log('Begin...');

recognition.onresult = function(event) {

  var res = event.results[0][0].transcript;
  //console.log('Res : '+res+' '+'Confidence: ' + event.results[0][0].confidence);
  console.log('Res : '+res);
  if(res.toLocaleLowerCase().includes("answer")==true || res.toLocaleLowerCase().includes("answers")==true || res.toLocaleLowerCase().includes("question")==true || res.toLocaleLowerCase().includes("questions")==true || res.toLocaleLowerCase().includes("discord")==true )
  {
    var x=document.getElementById("warn").innerHTML;
    document.getElementById("warn").innerHTML=parseInt(x)+1;
    if(document.getElementById("warn").innerHTML>10)
    {
      window.location.assign("http://127.0.0.1:8000/");
    }

    alert("Warning : Mouth movement detected");
  }
}


recognition.onnomatch = function(event) {
  console.log("Didn't Recognize");
}

recognition.onerror = function(event) {
  console.log("Error");
}


};



startVideo();
document.body.onclick = function() {
    setTimeout(main2,5000);
}

video.addEventListener("loadeddata", async () => {

model = await blazeface.load();
model1 =await cocoSsd.load();
setInterval(main,200);
setInterval(main1,100);


});



