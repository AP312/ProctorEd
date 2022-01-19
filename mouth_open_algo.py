import math


def lip_height(lip):
    sum = 0
    for i in [2, 3, 4]:
        distance = math.sqrt((lip[i][0] - lip[12 - i][0]) ** 2 +
                             (lip[i][1] - lip[12 - i][1]) ** 2
                             )
        sum += distance
    return sum / 3


def mouth_height(top_lip, bottom_lip):
    sum = 0
    for i in [8, 9, 10]:
        distance = math.sqrt((top_lip[i][0] - bottom_lip[18 - i][0]) ** 2 +
                             (top_lip[i][1] - bottom_lip[18 - i][1]) ** 2
                             )
        sum += distance
    return sum / 3


def is_mouth_open(face_landmarks):
    top_lip = face_landmarks['top_lip']
    bottom_lip = face_landmarks['bottom_lip']

    top_lip_height = lip_height(top_lip)
    bottom_lip_height = lip_height(bottom_lip)
    mouth_heights = mouth_height(top_lip, bottom_lip)

    ratio = 0.35
    if mouth_heights > min(top_lip_height, bottom_lip_height) * ratio:
        return True
    return False
