"""
URL configuration for taskCheckProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 회원가입/로그인
    path('accounts/',include('accounts.urls', namespace='accounts')),
    path('story/', include('story.urls')),  # story 앱의 URL 패턴 추가
    path('home/', include('home.urls')), # home 앱의 URL 패턴 추가


    # 팀 생성
    path('teams/', include('teams.urls', namespace='teams')),

    path('', RedirectView.as_view(url='story/', permanent=True)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
