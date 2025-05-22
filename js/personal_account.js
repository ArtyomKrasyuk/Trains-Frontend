let form = document.querySelector('.password_change_form');
form.hidden = true;

document.getElementById('password_btn').onclick = function(e){
  form.hidden = false;
}

document.getElementById('close').onclick = function(e){
  form.hidden = true;
}

document.querySelector('.confirm_btn').onclick = async function(e){
  let oldPassword = document.getElementById('current').value;
  let newPassword = document.getElementById('new').value;
  let newRepeat = document.getElementById('new_repeat').value;
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
    oldPassword = '';
    newPassword = '';
    newRepeat = '';
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

// Функция для активации поля ввода и установки курсора в конец
function enableInput(button) {
  // Находим поле ввода, связанное с кнопкой
  const targetId = button.getAttribute('data-target');
  const inputField = document.querySelector(`.${targetId}`);

  if (inputField) {
    inputField.disabled = false;
    inputField.style.pointerEvents = 'auto';

    inputField.focus();
    inputField.value = '';

    // Добавляем обработчик события нажатия клавиши Enter
    inputField.addEventListener('keydown', async function(event) {
      if (event.key === 'Enter') {
        inputField.disabled = true;
        inputField.style.pointerEvents = 'none';

        // Определяем поле для отправки на сервер
        const path = getPath(inputField.classList);
        let newValue = inputField.value;
        if(path == 'change-gender'){
          if(newValue == 'Муж') newValue = 1;
          else if(newValue == 'Жен') newValue = 2;
          else{
            alert("Неправильно указан пол (Муж/Жен)");
            getClientData();
            return;
          }
        }

        // Отправляем PATCH-запрос
        try {
          const response = await fetch(`http://127.0.0.1:8080/client/${path}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'value': newValue
            }),
            credentials: 'include'
          });
          if(response.ok){
            alert('Успешно');
          }
          else if (response.status == 400) {
            let body = await response.json();
            let message = body.violations[0].message;
            alert(message);
            getClientData();
          }
          else{
            alert('Произошла ошибка');
            getClientData();
          }
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
    });
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
    let gender = document.querySelector(".input-gender");
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

    if(json.gender == 1) gender.value = 'Муж';
    else if(json.gender == 2) gender.value = 'Жен';
  }
  else{
    alert("Не удалось загрузить данные пользователя");
  }
}

getClientData();