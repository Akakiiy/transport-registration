export const resources = {
  ru: {
    translation: {
      phoneInput: {
        title: 'Ввод телефона',
      },
      roleSelect: {
        title: 'Выбор роли',
      },
      smsConfirm: {
        title: 'Подтверждение SMS',
      },
      registration: {
        title: 'Регистрация',
      },
      profile: {
        title: 'Профиль',
      },
      common: {
        next: 'Далее',
        back: 'Назад',
        loading: 'Загрузка...',
        save: 'Сохранить',
        cancel: 'Отмена',
        error: 'Ошибка',
        language: 'Язык',
        ru: 'RU',
        en: 'EN',
      },
      errors: {
        invalidSmsCode: 'Неверный SMS-код',
        invalidIin: 'Неверный ИИН',
        required: 'Поле обязательно',
        invalidDate: 'Некорректная дата',
        ageRestriction: 'Возраст должен быть от 18 до 64 лет',
      },
    },
  },
  en: {
    translation: {
      phoneInput: {
        title: 'Phone Input',
      },
      roleSelect: {
        title: 'Role Select',
      },
      smsConfirm: {
        title: 'SMS Confirm',
      },
      registration: {
        title: 'Registration',
      },
      profile: {
        title: 'Profile',
      },
      common: {
        next: 'Next',
        back: 'Back',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        error: 'Error',
        language: 'Language',
        ru: 'RU',
        en: 'EN',
      },
      errors: {
        invalidSmsCode: 'Invalid SMS code',
        invalidIin: 'Invalid IIN',
        required: 'Required field',
        invalidDate: 'Invalid date',
        ageRestriction: 'Age must be between 18 and 64',
      },
    },
  },
} as const;
