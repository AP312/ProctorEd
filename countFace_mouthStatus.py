import argparse
import time
import itertools
import cv2
import face_recognition
import imutils
import pyautogui
from imutils.video import VideoStream
from mouth_open_algo import is_mouth_open


def is_speaking(mouthStatusList):
    OpenMouthIndices = [i for i in range(len(mouthStatusList)) if mouthStatusList[i] == 1]   #indices of only OpenedMouth [1,4,5,6,7,9,19,21,22,23,24]
    OpenMouthIndices_groups = [e - i for i, e in enumerate(OpenMouthIndices)]                #gathering list of consec elements [1, 3, 3, 3, 3, 4, 13, 14, 14, 14, 14]
    consec_count = [sum(1 for _ in g) for _, g in itertools.groupby(OpenMouthIndices_groups)] # counting similar elements [1, 4, 1, 1, 4]

    for i in range(7, 40):
        if i in consec_count:
            return "yawn"

    if mouthStatusList.count(1) in range(9, 20):
        return "speak"



# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-w", "--webcam", type=int, default=0,
                help="index of webcam on system")
args = vars(ap.parse_args())

faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# video_capture = cv2.VideoCapture(0)
vs = VideoStream(src=args['webcam']).start()
time.sleep(1.0)

Timer = int(10)

while True:
    prev = time.time()
    sec_counter = 1
    mouthStatusList = []

    while Timer > 0:
        # ret, frame = video_capture.read()
        frame = vs.read()
        frame = imutils.resize(frame, width=640)
        frame = cv2.flip(frame, 1)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face_landmark_list = face_recognition.face_landmarks(gray)

        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        i = 0
        for (x, y, w, h), face_landmark in zip(faces, face_landmark_list):
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            i += 1

            mouth_open = is_mouth_open(face_landmark)
            mouth_status = ' opened_mouth' if mouth_open else ' closed_mouth'
            mouthStatusList.append(1) if mouth_open else mouthStatusList.append(0)

            cv2.putText(frame, 'face no: ' + str(i) + mouth_status, (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (0, 0, 255), 2)

        # out.write(frame)
        cv2.imshow('Face', frame)
        cv2.imwrite('mypic.jpg',frame)
        cur = time.time()

        if cur - prev >= 1:
            prev = cur
            Timer -= 1
            print(f"{sec_counter} secs over")
            sec_counter += 1

        key = cv2.waitKey(1)
        if (key & 0xFF == ord('q')) or (key & 0xFF == 27):
            break

    if Timer == 0:
        Timer = int(10)
        sec_counter = 1

        if is_speaking(mouthStatusList)=="speak":
            pyautogui.alert("Warning : you're speaking")
        # elif is_speaking(mouthStatusList)=="yawn":
        #     pyautogui.alert("Warning : Don't keep your mouth open")

        print(mouthStatusList)
        print(len(mouthStatusList))
        mouthStatusList.clear()

    else:
        break

# video_capture.release()
cv2.destroyAllWindows()
vs.stop()