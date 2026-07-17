MICHIKATSU TV V6.2

[GitHub 업로드]
이 폴더 안의 파일과 폴더를 저장소 최상단에 그대로 업로드하세요.
.github 폴더도 함께 올려야 음악 재생목록이 자동 갱신됩니다.

[갤러리 사진 교체]
assets/gallery 폴더의 아래 파일을 같은 이름으로 덮어쓰면 됩니다.
- gallery1.jpg
- gallery2.png
- gallery3.png
- gallery4.jpg
- gallery5.png
- gallery6.png

파일 확장자를 바꾸려면 index.html의 해당 이미지 경로도 함께 바꿔야 합니다.
가장 간단한 방법은 기존 파일명과 확장자를 그대로 유지해 덮어쓰는 것입니다.
권장 크기: 1600x900 이상. 카드에서는 자동으로 자연스럽게 잘립니다.

[추천 영상 썸네일 교체]
assets/videos 폴더의 아래 파일을 같은 이름으로 덮어쓰세요.
- thumb1.jpg
- thumb2.png
- thumb3.png

[유튜브 링크 변경]
script.js 맨 위 SETTINGS.videoLinks 안의 주소 3개를 실제 영상 주소로 바꾸세요.
예: https://www.youtube.com/watch?v=영상ID
카드를 누르면 새 탭에서 해당 영상이 바로 열립니다.

[음악]
music 폴더에 음악을 추가/삭제해 GitHub에 커밋하면 playlist.json이 자동 갱신됩니다.


[V6.3 추가]
- 음악 플레이어가 우측 하단에 고정되어 스크롤해도 따라옵니다.
- 벚꽃/빛 파티클/안개/달빛 펄스/마우스 패럴랙스 효과를 강화했습니다.
- 모바일과 모션 감소 설정에서는 효과량이 자동으로 줄어듭니다.
