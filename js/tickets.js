'use strict'

let monthsShort = ['янв', 'фев', 'март', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

async function setData(){
    let url = 'http://127.0.0.1:8080/client/tickets';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let body = await response.json();
        let div = document.querySelector('.content-area');
        div.innerHTML = '';

        body.forEach(element => {
            let birthday = element.birthday.slice(8,10) + '.' + element.birthday.slice(5,7) + '.' + element.birthday.slice(0,4);
            let departureTime = element.departureTime.split(' ')[1].substring(0, 5);
            let arrivalTime = element.arrivalTime.split(' ')[1].substring(0, 5);
    
            let departureDate = new Date(element.departureTime);
            let arrivalDate = new Date(element.arrivalTime);
            let now = new Date();
            let str = `<div class="ticket-area" id="${element.ticketNumber}">`;
            if(departureDate.getTime() > now.getTime()) str +='<button class="cancel-button">Отменить бронь</button>';
            str += `<button class="download-button">скачать pdf</button>
            <div class="ticket">
              <div class="dotted-line"></div>
              <div class="train-info-area">
                <p class="cities">САМАРА - ${element.destination.toUpperCase()}</p>
                <p class="name">Поезд ${element.trainId}</p>
              </div>
              <div class="ticket-info-area">
                <div class="seat-info-area">
                  <p class="wagon">${element.carriageNumber}</p>
                  <p class="seat">${element.position}</p>
                  <p class="wagon-type">${element.type}</p>
                </div>
                <div class="personal-info-area">
                  <p class="FIO">${element.lastname.toUpperCase()} ${element.firstname.toUpperCase()} ${element.patronymic.toUpperCase()}</p>
                  <p class="birth-date">${birthday}</p>
                </div>
                <div class="personal-ticket-info-area">
                  <p class="passport">${element.passport.slice(0,4)} ${element.passport.slice(4,10)}</p>
                  <p class="ticket-number">${element.ticketNumber}</p>
                </div>
              </div>
              <div class="route-area">
                <div class="departure-time-area">
                  <p class="date">${departureDate.getDate()} ${monthsShort[departureDate.getMonth()]}</p>
                  <p class="time">${departureTime}</p>
                </div>
                <div class="arrival-time-area">
                  <p class="date">${arrivalDate.getDate()} ${monthsShort[arrivalDate.getMonth()]}</p>
                  <div class="arrival-time-group">
                    <p class="time">${arrivalTime}</p>
                    <p class="label">(Самара)</p>
                  </div>
                </div>
              </div>
              <div class="departure-timedate-area">
                <div class="date">
                  <p class="day">${departureDate.getDate()}</p>
                  <p class="month">${months[departureDate.getMonth()]}</p>
                </div>
                <p class="time">${departureTime}</p>
              </div>
            </div>
          </div>`;
          div.insertAdjacentHTML('beforeend', str);
        });
      setButtons();
    }
}

setData();

function setButtons(){
  let buttons = document.querySelectorAll('.cancel-button');
  buttons.forEach(button=>{
    button.onclick = async function(e){
      let ticketNumber = e.currentTarget.parentElement.id;
      let url = `http://127.0.0.1:8080/client/delete-ticket/${ticketNumber}`;
      let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
      });
      if(response.ok) setData();
      else alert('Произошла ошибка при отмене');
    }
  });
}