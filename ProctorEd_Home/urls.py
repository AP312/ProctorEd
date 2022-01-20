"""ProctorEd URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.display_home, name="Home Page"),
    path('Login', views.display_login, name="Login Page"),
    path('CreateQuiz', views.display_cquiz, name="CreateQuiz Page"),
    path('Quiz', views.display_quiz, name="Quiz Page"),
    path('Participate', views.display_participate, name="Participate Page"),
    path('Submission', views.display_submission, name="Submission Page")
    

]
