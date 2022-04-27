![alt error](/images/mapping.png)

## 매핑을 할 때 오류

        "type": "illegal_argument_exception",
        "reason": "Mapper for [name] conflicts with     existing mapper:\n\tCannot update parameter     [analyzer] from [default] to [my_ngram_analyzer]"

해당 인덱스가 미리 매핑으로 정의가 되어있어 나오는 오류 <br>
매핑은 기존에 있던 컬럼들에 걸려있으면 풀어 줄 수가 없음 <br>
새로 추가하는 컬럼이나 또는 docker로 재빌드를 해 해당 테이블의 내용들을 밀어야만 매핑 설정을 새로 해줄 수 있음
