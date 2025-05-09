let tripId = new URLSearchParams(window.location.search).get('tripId');
let male = false;
let female = false;

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.data-form');
  const inputs = form.querySelectorAll('.input-box[required]');
  const acceptCheckbox = document.querySelector('.acceptation-button');
  const continueButton = document.querySelector('.continue-button');
  const maleButton = document.querySelector('.male-button');
  const femaleButton = document.querySelector('.female-button');

  let genderSelected = false;

  // Функция проверки заполненности формы
  function checkFormValidity() {
    let allFilled = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });

    const accepted = acceptCheckbox.checked;

    if (!allFilled) {
        continueButton.setAttribute('data-tooltip', 'Не все поля заполнены');
    } else if (!genderSelected) {
        continueButton.setAttribute('data-tooltip', 'Выберите пол');
    } else if (!accepted) {
        continueButton.setAttribute('data-tooltip', 'Необходимо дать согласие на обработку персональных данных');
    } else {
        continueButton.removeAttribute('data-tooltip');
    }

    // Активируем/деактивируем кнопку
    continueButton.disabled = !(allFilled && accepted && genderSelected);
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

  // Слушатель изменения во всех полях
  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  // Слушатель изменений чекбокса
  acceptCheckbox.addEventListener('change', checkFormValidity);

  // Инициализация проверки при загрузке
  checkFormValidity();
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