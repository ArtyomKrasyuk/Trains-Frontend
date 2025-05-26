'use strict'

class Trip{
    constructor(tripId, trainId, destination, departureTime, arrivalTime, hasFreePlaces, prices){
        this.tripId = tripId;
        this.trainId = trainId;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.hasFreePlaces = hasFreePlaces;
        this.prices = prices
    }
}

let cityParam = new URLSearchParams(window.location.search).get('city');
let dateParam = new URLSearchParams(window.location.search).get('date');

const availabilityPanel = document.querySelector('.availability-panel');
const availabilityIcon = document.querySelector('.availability-icon');

let months = ['янв', 'фев', 'март', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];

let trips = [];
let dates = [];

let selectCity = document.getElementById('select_city');
let selectPlace = document.getElementById('place');
let selectDate = document.getElementById('date_input');

document.getElementById('set').onclick = function(e){
  if(selectCity.value == 'Город' || selectDate.value == '') alert('Должны быть указаны город и дата отправления');
  else setTrips();
}

selectPlace.onchange = setTrips;

async function getCities(){
    let url = 'http://127.0.0.1:8080/get-cities';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let body = await response.json();
        body.forEach(city=>{
            selectCity.insertAdjacentHTML('beforeend', `<option>${city.cityName}</option>`)
        });
    }
    else alert('Ошибка в получении списка городов');
}

async function getTrips(){
    let url = 'http://127.0.0.1:8080/trips-with-prices';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let body = await response.text();
        let json = JSON.parse(body);
        json.forEach(trip=>{
            let tripObj = new Trip(trip.tripId, trip.trainId, trip.destination, trip.departureTime, trip.arrivalTime, trip.hasFreePlaces, trip.prices);
            trips.push(tripObj);
            dates.push(trip.departureTime.split(' ')[0]);
        });
    }
    else alert('Не удалось загрузить рейсы');
    window.flatpickr('#date_input', {
        'locale': 'ru',
        enable: dates,
        dateFormat: 'd.m.Y'
    });

    selectCity.value = cityParam;
    selectDate.value = dateParam;
}

async function setData(){
    await getCities();
    await getTrips();
    await setTrips();
}

setData();

function setTrips(){
    let container = document.querySelector('.ticket-area');
    container.innerHTML = '';

    for(let i = 0; i < trips.length; i++){
      let trip = trips[i];
      if(availabilityPanel.classList.contains('active') && trip.freePlaces == false) continue;
      if(selectCity.value != 'Все' && selectCity.value != 'Город' && selectCity.value != trip.destination) continue;
      if(selectPlace.value != 'Все' && selectPlace.value != 'Тип вагона'){
        let flag = false;
        for(let type in trip.prices){
          if(selectPlace.value == type) flag = true;
        }
        if(!flag) continue;
      }
      let [day, month, year] = selectDate.value.split('.');
      let dateStr = `${year}-${month}-${day}`;
      let departureTime = trip.departureTime.split(' ')[1].substring(0, 5);
      let date =  trip.departureTime.split(' ')[0];
      if(selectDate.value != '' && dateStr != date) continue;
      let arrivalTime = trip.arrivalTime.split(' ')[1].substring(0, 5);

      let departureDate = new Date(trip.departureTime);
      let arrivalDate = new Date(trip.arrivalTime);

      let substr = '';
      for(let key in trip.prices){
        substr += `<div class="fare-line">
            <span class="fare-type">${key}</span>
            <span class="fare-price">от ${trip.prices[key]} ₽</span>
          </div>`;
      }

      let str = 
      `<div class="ticket-panel">
        <div class="trip_id" style="display: none">${trip.tripId}</div>
        <div class="train-name">Поезд ${trip.trainId}</div>
        <div class="price-area">
          ${substr}
        </div>
        <button class="select-button">Выбрать места</button>
        <div class="route-area">
          <div class="departure-time-area">
            <p class="departure-date">${departureDate.getDate()} ${months[departureDate.getMonth()]}</p>
            <p class="departure-time">${departureTime}</p>
          </div>
          <div class="arrival-time-area">
            <p class="arrival-date">${arrivalDate.getDate()} ${months[arrivalDate.getMonth()]}</p>
            <div class="arrival-time-group">
              <p class="arrival-time">${arrivalTime}</p>
              <p class="arrival-time-label">(Самара)</p>
            </div>
          </div>
        </div>
      </div>`;
        
      container.insertAdjacentHTML('beforeend', str);
    }

    let buttons = document.querySelectorAll('.select-button');
    buttons.forEach(button=>{
        button.onclick = clickPath;
    });
}

function clickPath(e){
    let elem = e.currentTarget;
    let tripId = elem.parentElement.querySelector('.trip_id').innerHTML;
    window.location.href = `selection_of_seats.html?tripId=${tripId}`;
}

function toggleIcon() {
  if (availabilityIcon.src.includes('img/Done1.png')) {
    availabilityIcon.src = 'img/Unavailable1.png';
  } else {
    availabilityIcon.src = 'img/Done1.png';
  }
  availabilityPanel.classList.toggle('active');
  setTrips();
}

availabilityPanel.addEventListener('click', toggleIcon);