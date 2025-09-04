let tripId = new URLSearchParams(window.location.search).get('tripId');
let male = false;
let female = false;

function validateEmailFormat(value) {
  const emailRegex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) && value.length >= 15 && value.length <= 254;
}

function validateFirstname(name) {
  return name.length >= 2 && name.length <= 20;
}

function validateLastname(name) {
  return name.length >= 1 && name.length <= 45;
}

function validatePatronymic(name) {
  return name.length <= 20;
}

function applyCapitalizationHandlers() {
  const formatFirstLetterUppercase = (inputElement) => {
    inputElement.addEventListener('input', function () {
      const originalValue = inputElement.value;
      const originalCursor = inputElement.selectionStart;

      // Удаляем все символы, кроме букв
      const allowedOnly = originalValue.replace(/[^А-Яа-яЁёA-Za-z]/g, '');

      // Форматируем: первая заглавная, остальные строчные
      let formatted = '';
      if (allowedOnly.length > 0) {
        formatted = allowedOnly[0].toUpperCase() + allowedOnly.slice(1).toLowerCase();
      }

      // Вычисляем новую позицию курсора:
      let invalidBeforeCursor = 0;
      for (let i = 0; i < originalCursor; i++) {
        if (!/[А-Яа-яЁёA-Za-z]/.test(originalValue[i])) {
          invalidBeforeCursor++;
        }
      }

      inputElement.value = formatted;

      const newCursorPos = Math.max(0, originalCursor - invalidBeforeCursor);
      inputElement.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  formatFirstLetterUppercase(document.getElementById('firstname'));
  formatFirstLetterUppercase(document.getElementById('lastname'));
  formatFirstLetterUppercase(document.getElementById('patronymic'));
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.data-form');
  const inputs = form.querySelectorAll('.input-box[required]');
  const acceptCheckbox = document.querySelector('.acceptation-button');
  const continueButton = document.querySelector('.continue-button');
  const maleButton = document.querySelector('.male-button');
  const femaleButton = document.querySelector('.female-button');

  const phoneInput = document.getElementById('phone');

  // Автоустановка +7 и запрет на его удаление
  phoneInput.addEventListener('input', formatPhoneInput);
  phoneInput.addEventListener('keydown', preventDeletionOfPrefix);

  if (!phoneInput.value.startsWith('+7')) {
    phoneInput.value = '+7';
  }

  const passportInput = document.getElementById('passport');
  passportInput.addEventListener('input', formatPassportInput);


  const birthdayInput = document.getElementById('birthday');

  birthdayInput.birthInputHandler = function () {
    let position = birthdayInput.selectionStart;

    // Удаляем всё, кроме цифр, и обрезаем до 8 цифр (ДДММГГГГ)
    let digits = birthdayInput.value.replace(/\D/g, '').substring(0, 8);

    let formatted = '';
    if (digits.length > 0) {
      // День
      if (digits.length <= 2) {
        formatted = digits;
      } else {
        formatted = digits.substring(0, 2) + '.';
        // Месяц
        if (digits.length <= 4) {
          formatted += digits.substring(2);
        } else {
          formatted += digits.substring(2, 4) + '.';
          // Год
          formatted += digits.substring(4);
        }
      }
    }

    birthdayInput.value = formatted;

    setTimeout(() => {
      let newPos = position;

      if (position === 3 || position === 6) newPos++;
      if (newPos > birthdayInput.value.length) newPos = birthdayInput.value.length;

      birthdayInput.setSelectionRange(newPos, newPos);
    }, 0);
  };
  birthdayInput.addEventListener('input', birthdayInput.birthInputHandler);

  // Блокировка нецифрового ввода
  birthdayInput.addEventListener('keypress', function(e) {
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  });

  let genderSelected = false;

  function isValidPhoneNumber(phone) {
    return /^\+7\d{10}$/.test(phone);
  }

  function isValidDate(dateString) {
    const parts = dateString.split('.');
    if (parts.length !== 3) return false;

    const [day, month, year] = parts.map(Number);

    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 ||
      month < 1 || month > 12 ||
      year < 1900 || year > new Date().getFullYear()
    ) {
      return false;
    }

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date <= new Date()
    );
  }

  // Функция проверки заполненности формы
  function checkFormValidity() {
    let allFilled = true;
    let phoneValid = true;
    let birthValid = true;
    let passportValid = true;
    let firstnameValid = true;
    let lastnameValid = true;
    let patronymicValid = true;
    let emailValid = true;

    inputs.forEach(input => {
      if (!input.value.trim() && input.id != 'patronymic') {
        allFilled = false;
      }
    });

    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const patronymic = document.getElementById('patronymic');
    const email = document.getElementById('email');
    const passport = document.getElementById('passport');

    const passportRegex = /^\d{10}$/;

    if (!validateFirstname(firstname.value)) {
      firstnameValid = false;
    }

    if (!validateLastname(lastname.value)) {
      lastnameValid = false;
    }

    if (!validatePatronymic(patronymic.value)) {
      patronymicValid = false;
    }

    if (!validateEmailFormat(email.value)) {
      emailValid = false;
    }

    if (!passportRegex.test(passport.value)) {
      passportValid = false;
    }

    const phoneInput = document.getElementById('phone');
    if (!isValidPhoneNumber(phoneInput.value)) {
      phoneValid = false;
    }


    const birthdayInput = document.getElementById('birthday');
    if (!isValidDate(birthdayInput.value)) {
      birthValid = false;
    }


    const accepted = acceptCheckbox.checked;


    if (!allFilled) {
        continueButton.setAttribute('data-tooltip', 'Не все поля заполнены');
    } else if (!genderSelected) {
        continueButton.setAttribute('data-tooltip', 'Выберите пол');
    } else if (!accepted) {
        continueButton.setAttribute('data-tooltip', 'Необходимо дать согласие на обработку персональных данных');
    } else if (!birthValid) {
        continueButton.setAttribute('data-tooltip', 'Введите корректную дату рождения');
    } else if(!passportValid){
        continueButton.setAttribute('data-tooltip', 'Введите паспорт (10 цифр)');
    } else if(!emailValid){
        continueButton.setAttribute('data-tooltip', 'Введите корректный email');
    } else if(!firstnameValid){
        continueButton.setAttribute('data-tooltip', 'Введите корректное имя (2–20 букв)');
    } else if(!lastnameValid){
        continueButton.setAttribute('data-tooltip', 'Введите корректную фамилию (1–45 букв)');
    } else if(!patronymicValid){
        continueButton.setAttribute('data-tooltip', 'Введите корректное отчество (до 20 букв)');
    } else if(!phoneValid){
        continueButton.setAttribute('data-tooltip', 'Введите корректный номер телефона в формате +7xxxxxxxxxx');
    } else {
        continueButton.removeAttribute('data-tooltip');
    }

    // Активируем/деактивируем кнопку
    continueButton.disabled = !(allFilled && accepted && genderSelected && phoneValid && birthValid
                && passportValid && emailValid && firstnameValid && lastnameValid && patronymicValid);
  }

  // Выбор пола
  function activateButton(buttonToActivate, buttonToDeactivate) {
    buttonToActivate.classList.add('active');
    buttonToDeactivate.classList.remove('active');
    genderSelected = true;
    checkFormValidity();
  }

  // Обработчики кликов для выбора пола
  maleButton.addEventListener('click', function() {
    activateButton(maleButton, femaleButton);
    male = true;
    female = false;
  });

  femaleButton.addEventListener('click', function() {
    activateButton(femaleButton, maleButton);
    male = false;
    female = true;
  });

  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  acceptCheckbox.addEventListener('change', checkFormValidity);

  // Инициализация проверки при загрузке
  checkFormValidity();
});

async function getClientData(){
  let url = 'http://127.0.0.1:8080/client/data';
  let response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      },
      credentials: 'include'
  });
  if(response.ok){
    let body = await response.text();
    json = JSON.parse(body);

    let firstname = document.getElementById("firstname");
    let lastname = document.getElementById("lastname");
    let patronymic = document.getElementById("patronymic");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");
    let male = document.getElementById("male");
    let female = document.getElementById("female");
    let birthday = document.getElementById("birthday");


    firstname.value = json.firstname;
    lastname.value = json.lastname;
    patronymic.value = json.patronymic;
    email.value = json.login;
    phone.value = json.phone;
    if(json.birthday == '') birthday.value = '';
    else birthday.value = json.birthday.slice(8,10) + '.' + json.birthday.slice(5,7) + '.' + json.birthday.slice(0,4);
    if(json.gender == 1) male.click();
    else if(json.gender == 2) female.click();
  }
}

getClientData();

document.querySelector('.continue-button').onclick = function(){
  let firstname = document.getElementById("firstname").value;
  let lastname = document.getElementById("lastname").value;
  let patronymic = document.getElementById("patronymic").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;
  let birthday = document.getElementById("birthday").value;
  let passport = document.getElementById("passport").value;

  let gender = 0;
  if(male) gender = 1;
  else gender = 2;

  let obj = {
    'firstname': firstname,
    'lastname': lastname,
    'patronymic': patronymic,
    'phone': phone,
    'email': email,
    'gender': gender,
    'birthday': birthday,
    'passport': passport
  }

  localStorage.setItem('clientData', JSON.stringify(obj));
  window.location.href = `booking-confirmation.html?tripId=${tripId}`;
}

document.querySelector('.icon-button').onclick = function(){
  window.location.href = `selection_of_seats.html?tripId=${tripId}`;
}

function formatPhoneInput(e) {
  let input = e.target;
  let position = input.selectionStart;

  let originalValue = input.value;

  // Удаляем всё кроме цифр
  let digits = originalValue.replace(/\D/g, '');

  // Удаляем первую 8 или 7, если введено после +7
  if (digits.startsWith('8')) digits = digits.slice(1);
  if (digits.startsWith('7')) digits = digits.slice(1);

  // Ограничиваем до 10 цифр
  digits = digits.slice(0, 10);

  // Формируем новое значение с +7
  let newValue = '+7' + digits;

  // Считаем смещение курсора
  let nonDigitBeforeCursor = 0;
  for (let i = 0; i < position; i++) {
    if (originalValue[i] && /\D/.test(originalValue[i])) nonDigitBeforeCursor++;
  }

  // Новая позиция курсора: старая позиция минус нецифры до курсора + длина '+7' (2 символа)
  let newCursorPos = position - nonDigitBeforeCursor + 2;
  if(newCursorPos > 2) newCursorPos--;

  if (newCursorPos > newValue.length) newCursorPos = newValue.length;

  input.value = newValue;

  setTimeout(() => {
    input.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);
}

function preventDeletionOfPrefix(e) {
  const start = phoneInput.selectionStart;

  // Запрещаем удалять +7
  if ((e.key === 'Backspace' || e.key === 'Delete') && start <= 2) {
    e.preventDefault();
  }

  // Запрещаем ввод нецифровых символов
  if (
    !['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(e.key) &&
    !/^\d$/.test(e.key)
  ) {
    e.preventDefault();
  }
}

function formatPassportInput(e) {
  const input = e.target;
  const originalValue = input.value;
  const originalCursor = input.selectionStart;

  // Удаляем все нецифры
  const digits = originalValue.replace(/\D/g, '').slice(0, 10);

  let nonDigitsBeforeCursor = 0;
  for (let i = 0; i < originalCursor; i++) {
    if (/\D/.test(originalValue[i])) {
      nonDigitsBeforeCursor++;
    }
  }

  const newCursorPos = Math.max(0, originalCursor - nonDigitsBeforeCursor);

  input.value = digits;

  // Ставим курсор обратно
  setTimeout(() => {
    input.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);
}

applyCapitalizationHandlers();