> #  GCP storage

- gcp storage는 파일 업로드를 할 때 용량을 줄일 수 있는 방법으로
- 데이터 센터에서 서버를 빌려와 서비스 운영에만 집중할 수 있게 해줌

> > ## Storage 생성 방법

1. GCP 안 메뉴바 저장소 cloud-storage 로 들어가기
   ![alt storage1](/images/1.png)

2. 버킷만들기 클릭
   ![alt storage2](/images/2.png)

3. 옵션 선택
   ![alt storage3](/images/3.png)

> > ## Storage 서비스 계정 설정

1. IAM 및 관리자에 서비스 계정으로 들어가기
   ![alt services](/images/11.png)

2. 서비스 계정 세부정보에서 서비스 계정 이름, 설명 을 입력하고나면 아래화면이 나옴 역할을 '소유자'로
   ![alt services](/images/22.png)

3. 마지막으로 생성한 계정으로 들어가 키를 추가하고 json파일로 받아서 작업환경 만들기
   ![alt services](/images/33.png)

> > > ## image upload Process
> > >
> > > ![alt upload](/images/111.png)
