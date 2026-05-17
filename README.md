# Transport Registration

React Native CLI приложение-прототип для регистрации пользователя в роли **заказчика** или **перевозчика**.

Проект реализует полный клиентский flow без backend: ввод телефона, подтверждение SMS-кодом, выбор роли, заполнение
регистрационных данных, создание пароля, сохранение профиля, PIN-авторизация, редактирование профиля и logout.

---

## Стек

- React Native CLI
- TypeScript
- React Navigation
- React Hook Form
- Zod
- react-i18next / i18next
- AsyncStorage
- react-native-mask-text
- @react-native-community/datetimepicker
- @react-native-picker/picker

---

## Установка и запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить Metro

```bash
npm run start
```

### 3. Запустить Android

Во втором терминале:

```bash
npm run android
```

Проект рассчитан на запуск через React Native CLI. Expo не используется.

---

## Основной flow приложения

### 1. Login screen

На первом экране пользователь вводит номер телефона.

Особенности:

- маска телефона;
- валидация номера;
- переключатель языка RU / EN;
- кнопка входа;
- переход к регистрации;
- если пользователь ввёл телефон на login screen и нажал “Зарегистрироваться”, номер автоматически подставляется в
  регистрацию.

---

### 2. Registration — Phone confirmation

Первый шаг регистрации — подтверждение телефона.

Особенности:

- номер телефона подтягивается из login screen, если пользователь ввёл его до перехода;
- телефон можно подтвердить через mock SMS;
- SMS-код хранится только локально в состоянии компонента и не сохраняется в AsyncStorage;
- есть resend timer;
- состояние шага сохраняется.

Тестовый SMS-код:

```text
1111
```

---

### 3. Registration — Role selection

После подтверждения телефона пользователь выбирает роль:

- Customer / Заказчик
- Carrier / Перевозчик

Особенности:

- выбранная роль подсвечивается;
- роль сохраняется в черновик;
- для перевозчика на следующем шаге появляются дополнительные поля водительского удостоверения;
- если пользователь сначала выбрал перевозчика, заполнил driver fields, а потом переключился на заказчика, driver fields
  очищаются и не сохраняются в профиль.

---

### 4. Registration — Details form

На этом шаге пользователь заполняет регистрационные данные.

Общие поля:

- company name / наименование компании;
- first name / имя;
- last name / фамилия;
- email;
- birth date / дата рождения;
- citizenship / гражданство;
- phone / телефон, read-only;
- IIN / ИИН;
- document number / номер документа;
- document issue date / дата выдачи;
- document issuer / кем выдано.

Для роли Carrier / Перевозчик дополнительно:

- driver license number;
- driver license category;
- driver license issue date.

Особенности:

- даты выбираются через DatePicker;
- гражданство выбирается через select;
- категория водительского удостоверения выбирается через select;
- телефон read-only;
- все обязательные поля валидируются;
- driver fields обязательны только для перевозчика;
- ошибки локализованы на RU / EN.

---

### 5. Registration — Password

Финальный шаг регистрации — создание пароля.

Требования к паролю:

- минимум 8 символов;
- минимум 1 заглавная буква;
- минимум 1 строчная буква;
- минимум 1 цифра;
- минимум 1 специальный символ.

Пример валидного пароля:

```text
Qwerty1!
```

Пароль и подтверждение пароля не сохраняются в AsyncStorage и не попадают в профиль.

---

### 6. Profile

После завершения регистрации создаётся локальный профиль.

Профиль отображает введённые данные:

- phone;
- role;
- company name;
- full name;
- email;
- birth date;
- citizenship;
- IIN;
- document number;
- document issue date;
- document issuer;
- driver license fields только для перевозчика.

В профиле доступны:

- редактирование данных;
- сохранение изменений;
- logout.

Profile edit реализован как отдельный локальный процесс и не связан с registration draft.

---

### 7. Auth PIN

Если профиль уже создан, при следующем запуске приложение открывает экран PIN-авторизации.

Тестовый PIN:

```text
1111
```

После успешного ввода PIN пользователь попадает в профиль.

---

## Сохранение состояния

Приложение использует AsyncStorage для хранения:

- черновика регистрации;
- подтверждённого профиля.

Черновик сохраняется автоматически.

Это значит, что пользователь может:

- начать регистрацию;
- закрыть приложение на любом шаге;
- открыть приложение снова;
- вернуться на тот же шаг с восстановленными данными.

Восстанавливаются:

- текущий шаг регистрации;
- телефон;
- выбранная роль;
- заполненные данные формы;
- timer/resend state, где применимо.

Не сохраняются:

- password;
- confirm password;
- SMS code;
- PIN code.

При наличии профиля приложение после перезапуска открывает PIN screen.

При logout профиль и черновик очищаются.

---

## Локализация

Поддерживаемые языки:

- Russian / RU
- English / EN

Локализованы:

- экраны;
- кнопки;
- labels;
- validation errors;
- role cards;
- profile fields;
- auth PIN screen.

Переключение языка работает без перезапуска приложения.

---

## Валидация

### Phone

- номер должен быть корректным для выбранной страны;
- применяется маска телефона;
- некорректный номер не позволяет продолжить flow.

### SMS

- mock-код: `1111`;
- неправильный код показывает ошибку;
- resend доступен после timer.

### Registration details

Валидируются:

- required fields;
- email format;
- birth date;
- age restriction;
- IIN;
- document fields;
- driver license fields for carrier.

Правила birth date:

- дата не может быть в будущем;
- возраст должен быть от 18 до 64 лет включительно.

Правила IIN:

- 12 цифр;
- проверка контрольной суммы.

### Password

Пароль должен соответствовать требованиям сложности.

---

## Тестовые данные

### Customer / Заказчик

```text
Phone:
+7 777 851 01 48

SMS code:
1111

Role:
Customer / Заказчик

Company name:
ТОО Феникс

First name:
Антон

Last name:
Косых

Email:
anton.customer@gmail.com

Birth date:
2001-01-01

Citizenship:
Kazakhstan

IIN:
010101500003

Document number:
123456789

Document issue date:
2020-01-15

Document issuer:
МВД РК

Password:
Qwerty1!

Confirm password:
Qwerty1!

PIN after restart:
1111
```

Ожидаемое поведение:

- driver license fields не отображаются;
- профиль не показывает driver block;
- profile edit не показывает driver fields;
- после restart приложение открывает PIN screen.

---

### Carrier / Перевозчик

```text
Phone:
+7 777 324 11 85

SMS code:
1111

Role:
Carrier / Перевозчик

Company name:
ТОО ТрансЛайн

First name:
Иван

Last name:
Петров

Email:
ivan.carrier@gmail.com

Birth date:
1995-05-15

Citizenship:
Kazakhstan

IIN:
950515300007

Document number:
987654321

Document issue date:
2019-03-10

Document issuer:
МВД РК

Driver license number:
DL1234567

Driver license category:
B

Driver license issue date:
2021-06-20

Password:
Qwerty1!

Confirm password:
Qwerty1!

PIN after restart:
1111
```

Ожидаемое поведение:

- driver license fields отображаются;
- без driver license fields нельзя продолжить регистрацию;
- профиль показывает driver block;
- profile edit позволяет редактировать driver fields;
- после restart приложение открывает PIN screen.

---

## Что проверить вручную

### Customer flow

1. Открыть приложение без профиля.
2. Ввести телефон на login screen.
3. Нажать регистрацию.
4. Проверить, что телефон подтянулся в registration.
5. Подтвердить SMS-кодом `1111`.
6. Выбрать роль Customer.
7. Заполнить registration details.
8. Убедиться, что driver fields не отображаются.
9. Создать пароль.
10. Проверить профиль.
11. Перезапустить приложение.
12. Проверить Auth PIN `1111`.
13. Проверить logout.

### Carrier flow

1. Открыть приложение без профиля.
2. Перейти в регистрацию.
3. Подтвердить SMS-кодом `1111`.
4. Выбрать роль Carrier.
5. Проверить, что driver fields появились.
6. Попробовать продолжить без driver fields — должны появиться ошибки.
7. Заполнить все данные.
8. Создать пароль.
9. Проверить профиль и driver block.
10. Перезапустить приложение.
11. Проверить Auth PIN `1111`.
12. Проверить редактирование профиля.

### Draft restore

Проверить восстановление после перезапуска:

- на шаге выбора роли;
- на шаге заполнения данных;
- на шаге пароля;
- после частичного заполнения формы;
- после смены роли Carrier → Customer.

---

## Известные ограничения

- Backend отсутствует, все проверки имитируются на клиенте.
- SMS и PIN являются mock-значениями.
- SMS-код в текущем прототипе — `1111`.
- PIN-код в текущем прототипе — `1111`.
- APK не приложен, проект запускается из исходного кода.
- Поддержка iOS не является основной целью в рамках задания.
- Светлая/тёмная тема не реализована, так как это опциональное требование.

---

## Структура проекта

Основные зоны:

```text
src/app
src/screens
src/features
src/shared
```

Ключевые части:

```text
src/features/auth/login-form
src/features/auth/registration-form
src/features/profile/edit-profile-form
src/screens/login
src/screens/registration
src/screens/profile
src/screens/auth-pin
src/shared/ui
src/shared/lib
src/shared/config
src/shared/types
```

Архитектурные решения:

- registration использует один общий `useForm` и `FormProvider`;
- registration steps используют `useFormContext`;
- profile edit изолирован от registration flow;
- shared UI содержит переиспользуемые поля, например DateField и SelectField;
- AsyncStorage используется через wrapper-функции;
- sensitive fields не сохраняются.

---

## Основные сценарии

### First launch

```text
No profile + no draft -> Login
```

### Draft exists

```text
No profile + draft exists -> Registration restored to saved step
```

### Profile exists

```text
Profile exists -> Auth PIN -> Profile
```

### Logout

```text
Profile -> Logout -> clear profile and draft -> Login
```

---

## Команды

```bash
npm install
npm run start
npm run android
```

---

## Notes

Проект реализует не только ручное сохранение черновика, но и автоматическое сохранение non-sensitive данных формы. Это
позволяет восстановить регистрацию после закрытия приложения без потери уже введённых данных.
