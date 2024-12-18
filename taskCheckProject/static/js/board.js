Kakao.init('c018c1fdf296122d84ba45b417ca6510');  // Kakao Developers에서 발급받은 앱 키 입력
function sendKakaoLink(code) {
    const inviteCode = code
    const inviteLink = `http://${window.location.hostname}:8000/accounts/login/`;

    console.log("Invite link:", inviteLink);  

    Kakao.Link.sendCustom({
      templateId: 112687,  // 생성한 템플릿 ID 입력
      templateArgs: {
        'invite_code': code,
        'link': inviteLink
      }
    });
  }
  
function showUploadForm(event) {
    event.stopPropagation(); 
    document.getElementById('upload-form').classList.remove('hidden');
}

function closeForm() {
    document.getElementById('upload-form').classList.add('hidden');
}

document.getElementById('create-comment-btn').addEventListener('click', function() {
    var goal = this.getAttribute('data-goal');
    var duration = this.getAttribute('data-duration');
    var username = this.getAttribute('data-username');
    var uploadImgUrl = this.getAttribute('data-uploadimgurl');

    console.log(goal, duration, username, uploadImgUrl);

    createComment(goal, duration, username, uploadImgUrl);
});

function showStory(element) {
    var popup = document.getElementById('story-popup');
    var popupImg = document.getElementById('popup-img');

    var uploadImage = element.getAttribute('data-upload-img');

    if (uploadImage && uploadImage.trim() !== '' && uploadImage !== 'None') {
        popupImg.src = uploadImage;
    } else {
        var characterImage = element.querySelector('img');
        if (characterImage) {
            popupImg.src = characterImage.getAttribute('src');
        } else {
            console.error("캐릭터 이미지를 찾을 수 없습니다.");
        }
    }
    popup.classList.remove('hidden');
}

function closePopUp() {
    document.getElementById('story-popup').classList.add('hidden');
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function createComment(goal, duration, username, uploadImgUrl) {
    console.log("createComment 함수 호출됨.");
    console.log("Goal:", goal);
    console.log("Duration:", duration);
    console.log("Username:", username);
    console.log("Upload Image URL:", uploadImgUrl);

    const formData = new FormData();
    formData.append('img_src', uploadImgUrl || document.getElementById('popup-img').getAttribute('src'));
    formData.append('goal', goal);
    formData.append('duration', duration);
    formData.append('username', username);

    fetch("/story_openai/story_query", {  // 적절한 URL로 변경
        method: "POST",
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken  // CSRF 토큰 포함
        },
    })
    .then(response => {
        if (!response.ok) {
            response.text().then(text => {
                console.log("HTTP 상태 코드:", response.status);
                console.log("응답 내용:", text);
            });
            throw new Error("HTTP 오류 상태 = " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("OpenAI 응답 데이터:", data);
        document.getElementById('openai-comment').textContent = data.response || "결과 없음";
    })
    .catch(error => {
        console.error("OpenAI 요청에서 오류 발생:", error);
        document.getElementById('openai-comment').textContent = "OpenAI 요청 실패: " + error.message;
    });
}
