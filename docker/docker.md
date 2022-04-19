# docker

># docker란?
*부팅 등 운영체제의 핵심 기능(커털)을 공유하는 가상 머신*

*  OS 전체를 새로 설치하지 않아도 됨
* 도커는 개발 환경 요소들이 설치된 모습을 이미지로 저장하고 저장한 이미지를 클라우드에 올림
* 이미지들이 서로 연결되서 동작하는 설정을 문서(Dockerfile)로 저장
* 새 컴퓨터에 가서 복사한 문서의 내용대로 이미지를 다운받아 설치

![alt docker](/images/docker.png)
왼쪽이 가상 머신, 오른쪽이 도커
* 도커에는 추가적인 운영체제 설치가 필요 없음
* 한 컴퓨터에서 다른 환경의 여러 서비스를 실행해야 하는 경우, 컨테이너로 분리되어 있어 서로 독립 실행 가능
* 가이드 문서의 환경 설정을 빠르게 구축할 수 있는 것이 도커

> # Docker file
* *컨테이너를 실행하기 전 이미지를 만들어야함*
* Dockerfile 이라는 이름의 파일을 만들고 이미지를 만들기 위한 명령어 입력 docker build 명령어를 통해 이지미 생성 <br><br>
```docker
FROM node:16

WORKDIR /my_backend/
COPY . /my_backend/

CMD node index.js
```

* FROM 리눅스: 최신버전 이런식으로 쓰면, 리눅스의 최신 버전이 깔린 컴퓨터가 한대 만들어짐

* FROM node:16: node,npm,yarn이 모두 깔린 리눅스 컴퓨터 한 대 생성

* 소스 코드를 가상 컴퓨터 안에 넣고 싶을때

>>*index.js*
```javascript
console.log("docker")
```

이 index.js를 실행 시키고 싶을 때
>>>copy ./my_backend/
* 밖에 있는 소스 코드를 모두 my_backend 폴더로 복붙
>>>CMD node index.js
* 이것을 통해 복붙한 파일을 실행

하지만 지금은 어디서 저명령어를 실행해야 할지 모름
>>>WORKDIR /my_backend/
* 작업 폴더 지정

> ## node_modules
- 각자의 컴퓨터 환경에 설치된 node_modules폴더는
새로 만든 도커 컴퓨터와는 환경이 다르기 때문에 사용하면 안되고 , 가상 컴퓨터에서 모듈을 따로 설치해줘야함

>>>RUN yarn install
- dockerfile에 추가
```docker
FROM node:16

WORKDIR /my_backend/
COPY . /my_backend/

RUN yarn install
CMD node index.js
```

- 기존에 있는 node_modules 폴더까지 복사할 필요는 없음
그렇기 때문에 docker에서 무시하라고 알려주는 설정을 해줘야함
>>> .dockerignore
파일을 새로만들고 
```dockerignore
node_modules/
```

> # 포트 포워딩
>>> docker run -p 1000:3000 이미지_아이디