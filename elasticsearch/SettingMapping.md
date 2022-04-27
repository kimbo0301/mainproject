# 포스트맨 setting 설정

![alt setting](/images/setting.png)

- analyzer에 tokenizer는 아래 tokenizer에 셋팅을 물려받음
- 즉 my_ngram_tokenizer 을 my_ngram_analyzer로 가져옴

![alt settingResult](/images/settingResult.png)

- 받아온 결과 성공적으로 셋팅 등록 완료

# 포스트맨 Mapping 등록

1. 해당 테이블에 데이터가 있고 그 테이블 안의 컬럼에 셋팅을 걸고 맵핑으로 연결시켜주고싶다면 먼저 해당 테이블의 데이터를 docker systemp prune -a 로 모두 지워줌

2. 해당 테이블에 빈 데이터를 만들어 인덱스를 새로 생성해줌
   ![alt postman1](/images/postman1.png)

3. 해당 인덱스에는 빈 데이터가 들어있음 이제 매핑 설정이 가능해짐<br>
   이제 해당 인덱스를 먼저 \_close해줌
   ![alt postman2](/images/postman2.png)

4. 대망의 매핑 설정 사용하고자 하는 컬럼에 셋팅을 걸어주면 됨
   ![alt postman3](/images/postman3.png)

5. \_open으로 사용 가능하게 만들어주면 끝
   ![alt postman4](/images/postman4.png)
