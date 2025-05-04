'use strict'

let loginBtn = document.getElementById('login');
let personalAccountBtn = document.getElementById('pesonal_account');

loginBtn.hidden = true;
personalAccountBtn.hidden = true;

async function checkAuth(){
    let url = 'http://127.0.0.1:8080/client/test';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok) personalAccountBtn.hidden = false;
    else if(response.status == 403) loginBtn.hidden = false;
}

checkAuth();

async function getTrips(){
    let url = 'http://127.0.0.1:8080/trips';
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
        json.forEach(trip => {
            let departureTime = trip.departureTime.split(' ')[1].substring(0, 5);
            let arrivalTime = trip.arrivalTime.split(' ')[1].substring(0, 5);

            let departureDate = new Date(trip.departureTime);
            let arrivalDate = new Date(trip.arrivalTime);

            let diffMs = arrivalDate - departureDate;
            let diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            let diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            let diff = `${diffHrs} ч ${diffMin} м`;

            let str = '<div class="trip">'+
                '<div class="trip__top">'+
                    `<p class="top__path">Самара — ${trip.destination}</p>`+
                    `<p class="top__departure_time">${departureTime}</p>`+
                    `<p class="top__duration">${diff}</p>`+
                    `<p class="top__arrival_time">${arrivalTime}</p>`+
                    '<div class="top__btn">Выбрать дату</div>'+
                '</div>'+
                '<div class="trip__bottom">'+
                    `<div class="bottom__number">${trip.trainId}</div>`+
                    `<p class="trip_id" style="display: none;">${trip.tripId}</p>`+
                    '<div class="bottom__dates">13, 14, 15, 16, 17, 19, 21, 22, 23, 24, 26, 28, 29,'+
                        '30, 31 марта, 1, 2, 3, 4, 5 апреля, …</div>'+
                '</div>'+
            '</div>';
            
            let container = document.querySelector('.schedule__trips');
            container.insertAdjacentHTML('beforeend', str);
        });
        let paths = document.querySelectorAll('.top__path');
        paths.forEach(path=>{
            path.onclick = clickPath;
        });
    }
}

getTrips();

function clickPath(e){
    let elem = e.currentTarget;
    let tripId = elem.parentElement.parentElement.querySelector('.trip_id').innerHTML;
    window.location.href = `selection_of_seats.html?tripId=${tripId}`;
}