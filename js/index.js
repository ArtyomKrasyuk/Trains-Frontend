'use strict'

class Trip{
    constructor(tripId, trainId, destination, departureTime, arrivalTime, hasFreePlaces){
        this.tripId = tripId;
        this.trainId = trainId;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.hasFreePlaces = hasFreePlaces;
    }
}

let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

let loginBtn = document.getElementById('login');
let personalAccountBtn = document.getElementById('pesonal_account');

let freePlaces = document.getElementById('free_places');
let changeCity = document.getElementById('change_city');
let changeDate = document.getElementById('change_date');
let headerSelect = document.getElementById('header__select');
let headerDate = document.getElementById('header__date');
let searchTrips = document.getElementById('search_trips');

loginBtn.hidden = true;
personalAccountBtn.hidden = true;

let trips = {};
let dates = [];

changeCity.onchange = setTrips;
changeDate.onchange = function(){
    let div = document.getElementById('date_label');
    if(this.value == '') div.innerHTML = 'Дата';
    else{
        const [year, month, day] = this.value.split('-');
        div.innerHTML = `${day}.${month}.${year}`;
    }
    setTrips();
}
freePlaces.onclick = function(e){
    e.currentTarget.classList.toggle("active");
    setTrips();
}

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
            changeCity.insertAdjacentHTML('beforeend', `<option>${city.cityName}</option>`);
            headerSelect.insertAdjacentHTML('beforeend', `<option>${city.cityName}</option>`)
        });
    }
    else alert('Ошибка в получении списка городов');
}

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
        json.forEach(trip=>{
            let tripObj = new Trip(trip.tripId, trip.trainId, trip.destination, trip.departureTime, trip.arrivalTime, trip.hasFreePlaces);
            let key = `${trip.destination} ${trip.trainId}`;
            if(!trips[key]){
                let arr = [];
                arr.push(tripObj);
                trips[key] = arr;
            }
            else trips[key].push(tripObj);
            dates.push(trip.departureTime.split(' ')[0]);
        });
    }
    else alert('Не удалось загрузить рейсы');
    window.flatpickr('#change_date', {
        'locale': 'ru',
        enable: dates,
        dateFormat: 'Y-m-d'
    });
    window.flatpickr('#header__date', {
        'locale': 'ru',
        enable: dates,
        dateFormat: 'd.m.Y'
    });
    setHeaderInputs();
}

async function setData(){
    await getCities();
    await getTrips();
    await setTrips();
}

setData();


function setTrips(){
    let container = document.querySelector('.schedule__trips');
    container.innerHTML = '';

    for(let key in trips){
        if(trips[key].length == 1){
            let trip = trips[key][0];
            let departure = trip.departureTime.split(' ')[0];
            if(freePlaces.classList.contains('active') && trip.freePlaces == false) continue;
            if(changeCity.value != 'Все' && changeCity.value != 'Город' && changeCity.value != trip.destination) continue;
            if(changeDate.value != '' && changeDate.value != departure) continue;
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
                    `<p class="top__path">Самара — <span class="trip_destination">${trip.destination}</span></p>`+
                    `<p class="top__departure_time">${departureTime}</p>`+
                    `<p class="top__duration">${diff}</p>`+
                    `<p class="top__arrival_time">${arrivalTime}</p>`+
                    //'<div class="top__btn">Выбрать дату</div>'+
                    `<div class="top__btn seats">
                    Выбрать место
                    </div>`+
                '</div>'+
                '<div class="trip__bottom">'+
                    `<div class="bottom__number">${trip.trainId}</div>`+
                    `<p class="trip_id" style="display: none;">${trip.tripId}</p>`+
                    `<div class="bottom__dates">${departureDate.getDate()} ${months[departureDate.getMonth()]}</div>`+
                '</div>'+
            '</div>';
            
            container.insertAdjacentHTML('beforeend', str);
        }
        else{
            let valid = [];
            for(let i = 0; i < trips[key].length; i++){
                let trip = trips[key][i];
                let departure = trip.departureTime.split(' ')[0];
                if(freePlaces.classList.contains('active') && trip.freePlaces == false) continue;
                if(changeCity.value != 'Все' && changeCity.value != 'Город' && changeCity.value != trip.destination) continue;
                if(changeDate.value != '' && changeDate.value != departure) continue;
                valid.push(trip);
            }

            if(valid.length == 0) continue;
            else if(valid.length == 1){
                let trip = valid[0];

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
                        `<p class="top__path">Самара — <span class="trip_destination">${trip.destination}</span></p>`+
                        `<p class="top__departure_time">${departureTime}</p>`+
                        `<p class="top__duration">${diff}</p>`+
                        `<p class="top__arrival_time">${arrivalTime}</p>`+
                        //'<div class="top__btn">Выбрать дату</div>'+
                        `<div class="top__btn seats">
                        Выбрать место
                        </div>`+
                    '</div>'+
                    '<div class="trip__bottom">'+
                        `<div class="bottom__number">${trip.trainId}</div>`+
                        `<p class="trip_id" style="display: none;">${trip.tripId}</p>`+
                        `<div class="bottom__dates">${departureDate.getDate()} ${months[departureDate.getMonth()]}</div>`+
                    '</div>'+
                '</div>';
                
                container.insertAdjacentHTML('beforeend', str); 
            }
            else{
                let strDates = '';
                let hiddenDates = '';
                for(let i = 0; i < valid.length; i++){
                    let departureDate = new Date(valid[i].departureTime);
                    hiddenDates += valid[i].departureTime.split(' ')[0] + ' ';
                    strDates += `${departureDate.getDate()} ${months[departureDate.getMonth()]}, `;
                }

                strDates = strDates.slice(0, -2);
                hiddenDates = hiddenDates.slice(0, -1);

                let trip = valid[0];
    
                let str = '<div class="trip">'+
                    '<div class="trip__top">'+
                        `<p class="top__path">Самара — <span class="trip_destination">${trip.destination}</span></p>`+
                        `<p class="top__departure_time"></p>`+
                        `<p class="top__duration"></p>`+
                        `<p class="top__arrival_time"></p>`+
                        //'<div class="top__btn">Выбрать дату</div>'+
                        `<div class="top__btn date">
                        Выбрать дату
                        <input type="text" style="opacity: 0;" class="trip_date">
                        </div>`+
                        `<div class="top__btn seats" style="display: none;">
                        Выбрать место
                        </div>`+
                    '</div>'+
                    '<div class="trip__bottom">'+
                        `<div class="bottom__number">${trip.trainId}</div>`+
                        `<p class="trip_id" style="display: none;"></p>`+
                        `<div class="bottom__dates">${strDates}</div>`+
                        `<div class="hidden__dates" style="display: none">${hiddenDates}</div>`+
                    '</div>'+
                '</div>';
                
                container.insertAdjacentHTML('beforeend', str);  
            }
        }
    }


    /*
    trips.forEach(trip => {
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
                //'<div class="top__btn">Выбрать дату</div>'+
                `<div class="top__btn">
                Выбрать дату
                <input type="date" style="opacity: 0;">
                </div>`+
                `<div class="top__btn">
                Выбрать место
                </div>`+
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
    */
    let buttons = document.querySelectorAll('.seats');
    buttons.forEach(button=>{
        button.onclick = clickPath;
    });

    let btns = document.querySelectorAll('.date');
    btns.forEach(btn=>{
            window.flatpickr(btn.querySelector('.trip_date'), {
            'locale': 'ru',
            enable: getDates(btn),
            dateFormat: 'Y-m-d'
        });

        btn.querySelector('.trip_date').onchange = selectDate;
    });
}

function clickPath(e){
    let elem = e.currentTarget;
    let tripId = elem.parentElement.parentElement.querySelector('.trip_id').innerHTML;
    window.location.href = `selection_of_seats.html?tripId=${tripId}`;
}

function getDates(elem){
    let dates = elem.parentElement.parentElement.querySelector('.hidden__dates').innerHTML;
    return dates.split(' ');
}

function selectDate(e){
    let date = e.currentTarget.value;
    let parent = e.currentTarget.parentElement.parentElement.parentElement;
    let destination = parent.querySelector('.trip_destination').innerHTML;
    let trainId = parent.querySelector('.bottom__number').innerHTML;
    let key = `${destination} ${trainId}`;
    let flag = false;
    for(let i = 0; i < trips[key].length; i++){
        let tripDeparture = trips[key][i].departureTime.split(' ')[0];
        if(date == tripDeparture){
            flag = true;
            let trip = trips[key][i];
             let departureTime = trip.departureTime.split(' ')[1].substring(0, 5);
                let arrivalTime = trip.arrivalTime.split(' ')[1].substring(0, 5);
    
                let departureDate = new Date(trip.departureTime);
                let arrivalDate = new Date(trip.arrivalTime);
    
                let diffMs = arrivalDate - departureDate;
                let diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                let diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
                let diff = `${diffHrs} ч ${diffMin} м`;

                parent.querySelector('.top__departure_time').innerHTML = departureTime;
                parent.querySelector('.top__duration').innerHTML = diff;
                parent.querySelector('.top__arrival_time').innerHTML = arrivalTime;
                parent.querySelector('.trip_id').innerHTML = trip.tripId;
                parent.querySelector('.bottom__dates').innerHTML = `${departureDate.getDate()} ${months[departureDate.getMonth()]}`;
                parent.querySelector('.date').style.display = 'none';
                parent.querySelector('.seats').style.display = 'block';
            break;
        }
    }
    if(!flag) alert('У этого рейса нет такой даты');
}

function setHeaderInputs(){
    headerSelect.onchange = function(e){
        if(headerDate.value == '' && headerSelect.value != 'Все'){
            let newDates = [];
            for(let key in trips){
                for(let i = 0; i < trips[key].length; i++){
                    if(trips[key][i].destination == headerSelect.value){
                        newDates.push(trips[key][i].departureTime.split(' ')[0]);
                    }
                }
            }
            window.flatpickr('#header__date', {
                'locale': 'ru',
                enable: newDates,
                dateFormat: 'd.m.Y'
            });
        }
        else if(headerDate.value == '' && headerSelect.value == 'Все'){
            window.flatpickr('#header__date', {
                'locale': 'ru',
                enable: dates,
                dateFormat: 'd.m.Y'
            }); 
        }
    }

    headerDate.onchange = function(e){
        if(headerSelect.value == 'Все' || headerSelect.value == 'Куда'){
            let [day, month, year] = headerDate.value.split('.');
            let date = `${year}-${month}-${day}`;
            let newDestinations = [];
            for(let key in trips){
                for(let i = 0; i < trips[key].length; i++){
                    let departureTime = trips[key][i].departureTime.split(' ')[0];
                    if(departureTime == date){
                        newDestinations.push(trips[key][i].destination);
                        break;
                    }
                }
            }
            if(headerSelect.value == 'Куда'){
                headerSelect.innerHTML = '';
                headerSelect.insertAdjacentHTML('beforeend', '<option selected disabled>Куда</option>');
                headerSelect.insertAdjacentHTML('beforeend', '<option>Все</option>');
            }
            else{
                headerSelect.innerHTML = '';
                headerSelect.insertAdjacentHTML('beforeend', '<option disabled>Куда</option>');
                headerSelect.insertAdjacentHTML('beforeend', '<option selected>Все</option>');
            }
            for(let i = 0; i < newDestinations.length; i++){
                headerSelect.insertAdjacentHTML('beforeend', `<option>${newDestinations[i]}</option>`);
            }
        }
    }

    searchTrips.onclick = function(e){
        if(headerSelect.value == 'Куда' || headerDate.value == '') alert('Необходимо заполнить город назначения и дату отправления');
        else window.location.href = `trips.html?city=${headerSelect.value}&date=${headerDate.value}`;
    }
}