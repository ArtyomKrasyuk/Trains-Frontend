'use strict'

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
            let now = new Date();
            let str = `<div class="trip">
            <div class="trip__top">
                <p class="top__path">Самара — ${trip.destination}</p>
                <p class="top__departure_time">${departureTime}</p>
                <p class="top__duration">${diff}</p>
                <p class="top__arrival_time">${arrivalTime}</p>`;

            if(departureDate.getTime() > now.getTime()) str += `<div class="top__btn change">Изменить рейс</div>
            </div>
            <div class="trip__bottom">
                <div class="bottom__number">${trip.trainId}</div>
                <div class="top__btn delete">Удалить рейс</div>
            </div>
        </div>`;
            else{
                str += `</div>
                <div class="trip__bottom">
                    <div class="bottom__number">${trip.trainId}</div>
                </div>
            </div>`;
            }
            
            let container = document.querySelector('.trips');
            container.insertAdjacentHTML('beforeend', str);
        });
    }
}

getTrips();