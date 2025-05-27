let form = document.querySelector('.password_change_form');
form.hidden = true;

document.getElementById('password_btn').onclick = function(e){
  form.hidden = false;
}

document.getElementById('close').onclick = function(e){
  form.hidden = true;
}

const maleBtn = document.querySelector('.male-button');
const femaleBtn = document.querySelector('.female-button');

// Обработка кликов на кнопки пола
maleBtn.addEventListener('click', async function () {
  const success = await updateGenderOnServer(1);
  if (success) {
    maleBtn.classList.add('active');
    femaleBtn.classList.remove('active');
  }
});

femaleBtn.addEventListener('click', async function () {
  const success = await updateGenderOnServer(2);
  if (success) {
    femaleBtn.classList.add('active');
    maleBtn.classList.remove('active');
  }
});

document.querySelector('.confirm_btn').onclick = async function(e){
  let oldPassword = document.getElementById('current').value;
  let newPassword = document.getElementById('new').value;
  let newRepeat = document.getElementById('new_repeat').value;
  if(oldPassword.length < 8 || oldPassword.length > 15){
    alert('Старый пароль должен содержать от 8 до 15 символов');
    return;
  }
  if(newPassword.length < 8 || newPassword.length > 15){
    alert('Новый пароль должен содержать от 8 до 15 символов');
    return;
  }
  if(newPassword != newRepeat){
    alert('Повторение пароля не совпало с первым вариантом');
    return;
  }
  let url = 'http://127.0.0.1:8080/client/change-password';
  let response = await fetch(url, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        'oldPassword': oldPassword,
        'newPassword': newPassword
      }),
      credentials: 'include'
  });
  if(response.ok){
    form.hidden = true;
    document.getElementById('current').value = '';
    newPassword = document.getElementById('new').value = '';
    document.getElementById('new_repeat').value = '';
  }
  else if(response.status == 400){
    let body = await response.json();
    let message = body.violations[0].message;
    alert(message);
  }
  else{
    let message = await response.text();
    console.log(oldPassword);
    alert(message);
  }
}

document.getElementById('logout').onclick = async function(e){
  let url = 'http://127.0.0.1:8080/logout';
  let response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
  });
  if(response.ok) window.location.href = 'index.html';
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

function validateEmailFormat(value) {
  const emailRegex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) && value.length >= 15 && value.length <= 254;
}

function enableInput(button) {
  const targetId = button.getAttribute('data-target');
  const inputField = document.querySelector(`.${targetId}`);

  if (inputField) {
    inputField.disabled = false;
    inputField.style.pointerEvents = 'auto';

    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length); // курсор в конец строки

    // Для телефона
    if (inputField.classList.contains('input-phone-number')) {
      if (!inputField.value.startsWith('+7')) {
        inputField.value = '+7';
      }

      if (!inputField.phoneInputHandler) {
        inputField.phoneInputHandler = function () {
          let val = inputField.value;
          val = '+7' + val.replace(/\D/g, '').slice(1);
          inputField.value = val.slice(0, 12);
        };
        inputField.addEventListener('input', inputField.phoneInputHandler);
      }
    }

    // Для даты
    if (inputField.classList.contains('input-birth-date')) {
      if (!inputField.birthInputHandler) {
        inputField.birthInputHandler = function () {
          let position = inputField.selectionStart;

          // Удаляем всё, кроме цифр, и обрезаем до 8 цифр (ДДММГГГГ)
          let digits = inputField.value.replace(/\D/g, '').substring(0, 8);

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

          inputField.value = formatted;

          // Коррекция позиции курсора
          setTimeout(() => {
            let newPos = position;

            if (position === 3 || position === 6) newPos++;
            if (newPos > inputField.value.length) newPos = inputField.value.length;

            inputField.setSelectionRange(newPos, newPos);
          }, 0);
        };
        inputField.addEventListener('input', inputField.birthInputHandler);
      }
    }

    const originalValue = inputField.value;

    // Удалим предыдущий обработчик, если он был
    if (inputField.keydownHandler) {
      inputField.removeEventListener('keydown', inputField.keydownHandler);
    }

    // Новый обработчик
    inputField.keydownHandler = async function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();

        const path = getPath(inputField.classList);
        let newValue = inputField.value;

        if (path === 'change-phone') {
          const digits = newValue.replace(/\D/g, '');
          if (digits.length !== 11 || !newValue.startsWith('+7')) {
            alert('Введите корректный номер телефона в формате +7XXXXXXXXXX');
            inputField.focus();
            return;
          }
        }

        if (path === 'change-birthday') {
          const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
          if (!dateRegex.test(newValue)) {
            alert('Введите дату в формате дд.мм.гггг');
            inputField.focus();
            return;
          }
          const [day, month, year] = newValue.split('.').map(Number);
          const dateObj = new Date(year, month - 1, day);
          const today = new Date();
          if (
            dateObj.getFullYear() !== year ||
            dateObj.getMonth() !== month - 1 ||
            dateObj.getDate() !== day ||
            dateObj > today
          ) {
            alert('Введите корректную дату рождения (не в будущем)');
            inputField.focus();
            return;
          }
        }

        if (path === 'change-login' && !validateEmailFormat(newValue)) {
          alert("Введите корректный email (от 15 до 254 символов, формат name@domain.zone)");
          return;
        }

        if (path === 'change-firstname' && !validateFirstname(newValue)) {
          alert("Имя должно содержать от 2 до 20 символов");
          return;
        }

        if (path === 'change-lastname' && !validateLastname(newValue)) {
          alert("Фамилия должна содержать от 1 до 45 символов");
          return;
        }

        if (path === 'change-patronymic' && !validatePatronymic(newValue)) {
          alert("Отчество должно содержать до 20 символов");
          return;
        }

        inputField.disabled = true;
        inputField.style.pointerEvents = 'none';

        try {
          const response = await fetch(`http://127.0.0.1:8080/client/${path}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'value': newValue }),
            credentials: 'include'
          });

          if (response.ok) {
            alert('Успешно');
          } else if (response.status == 400) {
            let body = await response.json();
            let message = body.violations[0].message;
            alert(message);
            getClientData();
          } else {
            alert('Произошла ошибка');
            getClientData();
          }
        } catch (error) {
          console.error('Ошибка:', error);
        }

      } else if (event.key === 'Escape') {
        inputField.value = originalValue;
        inputField.disabled = true;
        inputField.style.pointerEvents = 'none';
      }
    };

    inputField.addEventListener('keydown', inputField.keydownHandler);
  }
}

// Функция для определения имени поля для отправки на сервер
function getPath(classList) {
  if (classList.contains('input-lastname')) return 'change-lastname';
  if (classList.contains('input-firstname')) return 'change-firstname';
  if (classList.contains('input-patronymic')) return 'change-patronymic';
  if (classList.contains('input-mail')) return 'change-login';
  if (classList.contains('input-birth-date')) return 'change-birthday';
  if (classList.contains('input-phone-number')) return 'change-phone';
  if (classList.contains('input-gender')) return 'change-gender';
  return 'unknown';
}

// Привязываем обработчик к кнопкам
const buttons = document.querySelectorAll('.icon-button');
buttons.forEach(button => {
  button.addEventListener('click', function() {
    enableInput(button);
  });
});

async function getClientData(){
  let url = 'http://127.0.0.1:8080/client/get-data';
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

    let firstname = document.querySelector(".input-firstname");
    let lastname = document.querySelector(".input-lastname");
    let patronymic = document.querySelector(".input-patronymic");
    let phone = document.querySelector(".input-phone-number");
    let email = document.querySelector(".input-mail");
    let birthday = document.querySelector(".input-birth-date");

    if(json.firstname == '') firstname.value = 'Имя';
    else firstname.value = json.firstname;

    if(json.lastname == '') lastname.value = 'Фамилия';
    else lastname.value = json.lastname;

    if(json.patronymic == '') patronymic.value = 'Отчество';
    else patronymic.value = json.patronymic;

    if(json.login == '') email.value = 'mail@mail.ru';
    else email.value = json.login;

    if(json.phone == '') phone.value = '+7XXXXXXXXXX';
    else phone.value = json.phone;

    if(json.birthday == '') birthday.value = 'xx.xx.xxxx';
    else birthday.value = json.birthday.slice(8,10) + '.' + json.birthday.slice(5,7) + '.' + json.birthday.slice(0,4);


    if (json.gender === 1) {
      maleBtn.classList.add('active');
      femaleBtn.classList.remove('active');
    } else if (json.gender === 2) {
      femaleBtn.classList.add('active');
      maleBtn.classList.remove('active');
    }


  }
  else{
    alert("Не удалось загрузить данные пользователя");
  }
}

async function updateGenderOnServer(genderValue) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/client/change-gender`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: genderValue }),
      credentials: 'include'
    });

    if (response.ok) {
      alert("Пол успешно обновлён");
      return true;
    } else if (response.status === 400) {
      const body = await response.json();
      alert(body.violations[0].message);
      await getClientData();
    } else {
      alert("Произошла ошибка при обновлении пола");
      await getClientData();
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось обновить пол");
  }

  return false;
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

  formatFirstLetterUppercase(document.querySelector('.input-lastname'));
  formatFirstLetterUppercase(document.querySelector('.input-firstname'));
  formatFirstLetterUppercase(document.querySelector('.input-patronymic'));
}

getClientData();
applyCapitalizationHandlers();
