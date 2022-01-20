from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def display_home(request):
    return render(request, 'Home.html')


def display_login(request):
    return render(request, 'Login.html')


def display_cquiz(request):
    return render(request, 'CreateQuiz.html')


def display_quiz(request):
    return render(request, 'Quiz.html')


def display_participate(request):
    return render(request, 'Participate.html')


def display_submission(request):
    return render(request, 'Submission.html')



