'use strict'

let tripId = parseInt(new URLSearchParams(window.location.search).get('tripId'));
let clientData = JSON.parse(localStorage.getItem('clientData'));
let selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

async function init(){
    let url = `http://127.0.0.1:8080/trip-info/${tripId}`;
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let body = await response.text();
        let data = JSON.parse(body);
        setData(data);
    }
}

init();

function setData(data){
    let departureTime = data.departureTime.split(' ')[1].substring(0, 5);
    let arrivalTime = data.arrivalTime.split(' ')[1].substring(0, 5);

    let departureDate = new Date(data.departureTime);
    let arrivalDate = new Date(data.arrivalTime);

    let diffMs = arrivalDate - departureDate;
    let diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    let diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let diff = `${diffHrs} ч ${diffMin} м`;

    let months = ['янв', 'фев', 'март', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    let str = '<div class="train-data">'+
        `<p class="cities-label">Самара - ${data.destination}</p>`+
        `<p class="train-name-label">Поезд ${data.trainId}</p>`+
    '</div>'+
    '<div class="route-area">'+
        '<div class="departure-time-area">'+
        `<p class="date">${departureDate.getDate()} ${months[departureDate.getMonth()]}</p>`+
        `<p class="time">${departureTime}</p>`+
        '</div>'+
        '<div class="arrival-time-area">'+
        `<p class="date">${arrivalDate.getDate()} ${months[arrivalDate.getMonth()]}</p>`+
        '<div class="arrival-time-group">'+
            `<p class="time">${arrivalTime}</p>`+
            '<p class="label">(Самара)</p>'+
        '</div>'+
        '</div>'+
    '</div>';

    selectedSeats.forEach(seat => {
        str += '<div class="seat-info-area">'+
        `<p class="wagon">${seat.carriageNumber}</p>`+
        `<p class="seat">${seat.seatNumber}</p>`+
        `<p class="wagon-type">${seat.carriageType}</p>`+
    '</div>';
    });

    let div = document.querySelector('.form');
    div.insertAdjacentHTML('beforeend', str);

    let gender = 'М';
    if(clientData.gender == 2) gender == 'Ж';

    let str1 = '<div class="personal-data">'+
        `<p class="lastname">${clientData.lastname}</p>`+
        `<p class="firstname">${clientData.firstname}</p>`+
        `<p class="middlename">${clientData.patronymic}</p>`+
        `<p class="gender">${gender}</p>`+
        `<p class="birthdate">${clientData.birthday}</p>`+
    '</div>'+
    `<p class="passport-number">${clientData.passport.substring(0, 4)} ${clientData.passport.substring(4, 10)}</p>`+
    '<div class="contact-data">'+
        `<p class="phone-number">${clientData.phone}</p>`+
        `<p class="email">${clientData.email}</p>`+
    '</div>';

    let div1 = document.querySelector('.passenger-data');
    div1.insertAdjacentHTML('beforeend', str1);
}

document.querySelector('.icon-button').onclick = function(){
    window.location.href = `passenger-data.html?tripId=${tripId}`;
}

document.querySelector('.confirm-button').onclick = async function(){
    let seats = [];
    selectedSeats.forEach(seat=>{
        let obj = {
            'carriageNumber': seat.carriageNumber,
            'position': seat.seatNumber,
            'price': seat.price
        }
        seats.push(obj);
    });
    let data = {
        'tripId': tripId,
        'firstname': clientData.firstname,
        'lastname': clientData.lastname,
        'patronymic': clientData.patronymic,
        'phone': clientData.phone,
        'email': clientData.email,
        'gender': clientData.gender,
        'birthday': clientData.birthday,
        'passport': clientData.passport,
        'bookings': seats
    };

    let url = 'http://127.0.0.1:8080/client/book';
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    if(response.ok) {
        window.location.href = 'confirmed.html';
    }
    else if(response.status == 403) window.location.href = 'login.html';
}