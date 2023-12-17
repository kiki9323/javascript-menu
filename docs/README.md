# 메뉴 추천

## 구현 목록

### 1. 구현 순서

1. 코치 이름 받기 (`,`로 구분)
2. 못 먹는 메뉴 받기 (코치 리스트 수 만큼 반복해서)
3. 카테고리 별 음식 추천

   3-1. 카테고리를 정한다.

   - 한 주에 같은 카테고리는 최대 2회
   - 아래 유틸 사용

   ```js
   const category = categories.get(Randoms.pickNumberInRange(1, 5));
   // (1 일식, 2 한식, 3 중식, 4 아시안, 5 양식)
   ```

   3-2. 메뉴

   - 메뉴는 중복되지 않아야 한다.
   - 아래 유틸 사용

   ```js
   const menu = Randoms.shuffle(menus)[0];

   // menus는 문자열 배열 형태
   // menus는 최초에 제공한 목록 그대로 전달 되어야 하고,
   // 이미 추천한 메뉴, 먹지 못하는 메뉴도 포함된 리스트를 같이 전달해야 한다.
   // 추천할 수 없는 메뉴인 경우 다시 섞어서 첫 번째 값 사용
   ```

### 2. 조건

- 코치 : 코치의 이름은 최소 2글자, 최대 4글자.  
  각 코치는 최소 0개, 최대 2개의 못 먹는 메뉴가 있다. (, 로 구분해서 입력한다.)

- 카테고리 : 한 주에 같은 카테고리는 최대 2회까지만 고를 수 있다.

- 메뉴 : 각 코치에게 한 주에 중복되지 않는 메뉴를 추천해야 한다.

### 옵시디언에 정리하여 옮길 것.

[부수함수](https://jojoldu.tistory.com/703)

SRP 원칙이 적용된 함수로 추출하는 것도 리팩토링이다. (설령 부작용 함수라 하더라도)  
다만, 리팩토링의 목적은 외부의 의존성이 없는 좋은 함수들을 많이 만들고, 외부에 영향을 주는 부작용 함수의 범위를 최소화 한다. 이를 위해서는 아래와 같은 사항을 따른다.

1. **부작용을 제외**한 순수한 로직만 추출해본다.
2. 추출된 순수 로직이 해야할 역할을 재정의하고, 책임에 맞는 **추상화**를 한다.
3. 순수 로직의 결과와 부작용 함수를 연결하는 것은 **메인 함수 (부작용 함수)** 에서 다룬다.
   > '메인 함수'는 이벤트 핸들러, 뷰 컴포넌트, 뷰 컨트롤러 등 부작용을 다루기 위한 Entry Point가 되는 함수들을 의미한다.

```js
// 1.부작용을 제외한 순수한 로직만 추출해본다.
// 리팩토링으로 만들어진 함수들은 모두 명시적인 입력값과 반환 결과를 모두 가지고 있다.
export async function notifyTag(fields: Field[]): Promise<void> {
  const { name: userTagName, count } = await getUserTag();

  if (hasTagName(fields, userTagName)) {
    showNotification(getTagCountMessage(userTagName, count));
  } else {
    showNotification(getEmptyMessage(userTagName));
  }
}

function hasTagName(fields: Field[], userTagName: string) {
  return fields.find((field) => field.tagName === userTagName);
}

function getTagCountMessage(userTagName: string, count: number) {
  return `${userTagName}의 개수는 ${count} 입니다.`;
}

function getEmptyMessage(userTagName: string) {
  return `${userTagName} 에 관련된 태그가 존재하지 않습니다.`;
}
```

이제 책임에 맞는 추상화를 해야한다.

```js
// 2. message 생성 추상화
export async function notifyTag(fields: Field[]): Promise<void> {
  const tag: Tag = await getUserTag();
  const tagMessage = getTagMessage(fields, tag);
  showNotification(tagMessage);
}

function getTagMessage(fields: Field[], tag: Tag) {
  const userField = fields.find((field) => field.tagName === tag.name);
  return userField ? `${tag.name}의 개수는 ${tag.count} 입니다.` : `${tag.name} 에 관련된 태그가 존재하지 않습니다.`;
}
```

부작용 함수? 함수에서 입력값과 반환값이 없다면 이는 부작용 함수일 확률이 높다.

- 인자값이 없는데 반환값이 있는 경우
- 인자값이 있는데 반환값이 없는 경우
- 인자값과 반환값 둘 다 없는 경우

> 부작용 함수 판별?
>
> > 1. 인자값과 반환값 둘 중 하나라도 존재하지 않거나
>
> > 2. async 가 있거나

그럴 때는

- 명시적인 입력값과 반환값이 있는 함수로 리팩토링하고
- 리팩토링 된 함수들의 책임과 역할을 적절하게 추상화한다.
