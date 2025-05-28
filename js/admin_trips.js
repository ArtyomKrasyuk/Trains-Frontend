'use strict'

let trainNumbers = [];
let cities = [];

async function checkAuth(){
    let url = 'http://127.0.0.1:8080/admin/test';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok) return true;
    else return false;
}

async function getTrains(){
    let url = 'http://127.0.0.1:8080/get-train-numbers';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let body = await response.json();
        body.forEach(number=>{
            trainNumbers.push(number.trainNumber);
        });
    }
    else alert('Ошибка в получении номеров поездов');
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
            cities.push(city.cityName);
        });
    }
    else alert('Ошибка в получении списка городов');
}

async function setData(){
    let check = await checkAuth();
    if(!check) window.location.href = 'loginadmin.html';
    else{
        await getCities();
        await getTrains();
        await getTrips();
    }
}

setData();

async function setButtons(){
    let trainBlocks = document.querySelectorAll('.train_select');
    trainBlocks.forEach(block => {
        block.innerHTML = '';
        block.insertAdjacentHTML('beforeend', '<option disabled selected>выберите поезд</option>');
        trainNumbers.forEach(train => {
            let str = `<option>${train}</option>`;
            block.insertAdjacentHTML('beforeend', str);
        });
    });

    let cityBlocks = document.querySelectorAll('.city_select');
    cityBlocks.forEach(block => {
        block.innerHTML = '';
        block.insertAdjacentHTML('beforeend', '<option disabled selected>выберите город</option>');
        cities.forEach(city => {
            let str = `<option>${city}</option>`;
            block.insertAdjacentHTML('beforeend', str);
        });
    });

    document.getElementById('append_departure_date').value = '';
    document.getElementById('append_departure_time').value = '';
    document.getElementById('append_arrival_date').value = '';
    document.getElementById('append_arrival_time').value = '';

    document.getElementById('append_submit').onclick = async function(e){
        let check = await checkAuth();
        if(!check) window.location.href = 'loginadmin.html';
        else{
            let train = document.getElementById('append_train').value;
            let city = document.getElementById('append_city').value;
            let departureDate = document.getElementById('append_departure_date').value;
            let departureTime = document.getElementById('append_departure_time').value;
            let arrivalDate = document.getElementById('append_arrival_date').value;
            let arrivalTime = document.getElementById('append_arrival_time').value;

            if(train == 'выберите поезд'){
                alert('Необходимо указать номер поезда');
                return;
            }
            train = parseInt(train);
            if(city == 'выберите город'){
                alert('Необходимо указать город назначения');
                return;
            }
            if(departureDate == ''){
                alert('Необходимо указать дату отправления поезда');
                return;
            }
            if(arrivalDate == ''){
                alert('Необходимо указать дату прибытия поезда');
                return;
            }

            if(departureTime == ''){
                alert('Необходимо указать время отправления поезда');
                return;
            }
            if(arrivalTime == ''){
                alert('Необходимо указать время прибытия поезда');
                return;
            }

            let departureStr = departureDate + ' ' + departureTime;
            let arrivalStr = arrivalDate + ' ' + arrivalTime;

            let departureObj = new Date(departureStr);
            let arrivalObj = new Date(arrivalStr);

            let now = new Date();

            if(departureObj < now){
                alert('Время отправления не может быть в прошлом');
                return;
            }
            if(arrivalObj < now){
                alert('Время прибытия не может быть в прошлом');
                return;
            }
            if(arrivalObj < departureObj){
                alert('Время прибытия не может быть раньше времени отправления');
                return;
            }
    
            let data = {
                "tripId": 0,
                "trainId": train,
                "destination": city,
                "departureTime": departureStr,
                "arrivalTime": arrivalDate + ' ' + arrivalTime
            };
    
            let url = 'http://127.0.0.1:8080/admin/add-trip';
            let response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include'
            });
            if(response.ok) {
                alert('Успешно');
                getTrips();
            }
            else alert('Ошибка при добавлении рейса');
        }
    }

    document.getElementById('change_submit').onclick = async function(e){
        let check = await checkAuth();
        if(!check) window.location.href = 'loginadmin.html';
        else{
            let train = document.getElementById('change_train').value;
            let city = document.getElementById('change_city').value;
            let departureDate = document.getElementById('change_departure_date').value;
            let departureTime = document.getElementById('change_departure_time').value;
            let arrivalDate = document.getElementById('change_arrival_date').value;
            let arrivalTime = document.getElementById('change_arrival_time').value;
            let tripId = parseInt(document.getElementById('change__trip_id').innerHTML);

            if(train == 'выберите поезд'){
                alert('Необходимо указать номер поезда');
                return;
            }
            train = parseInt(train);
            if(city == 'выберите город'){
                alert('Необходимо указать город назначения');
                return;
            }
            if(departureDate == ''){
                alert('Необходимо указать дату отправления поезда');
                return;
            }
            if(arrivalDate == ''){
                alert('Необходимо указать дату прибытия поезда');
                return;
            }

            if(departureTime == ''){
                alert('Необходимо указать время отправления поезда');
                return;
            }
            if(arrivalTime == ''){
                alert('Необходимо указать время прибытия поезда');
                return;
            }

            let departureStr = departureDate + ' ' + departureTime;
            let arrivalStr = arrivalDate + ' ' + arrivalTime;

            let departureObj = new Date(departureStr);
            let arrivalObj = new Date(arrivalStr);

            let now = new Date();

            if(departureObj < now){
                alert('Время отправления не может быть в прошлом');
                return;
            }
            if(arrivalObj < now){
                alert('Время прибытия не может быть в прошлом');
                return;
            }
            if(arrivalObj < departureObj){
                alert('Время прибытия не может быть раньше времени отправления');
                return;
            }
    
            let data = {
                "tripId": tripId,
                "trainId": train,
                "destination": city,
                "departureTime": departureStr,
                "arrivalTime": arrivalStr
            };
    
            let url = 'http://127.0.0.1:8080/admin/change-trip';
            let response = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include'
            });
            if(response.ok) {
                alert('Успешно');
                getTrips();
            }
            else alert('Ошибка при редактировании рейса');
        }
    }

    let changeButtons = document.querySelectorAll('.change');
    changeButtons.forEach(btn => {
        btn.onclick = async function(e){
            let div = e.currentTarget.parentElement.parentElement;
            let trainId = div.querySelector('.bottom__number').innerHTML;
            let destination = div.querySelector('.destination').innerHTML;
            let departureData = div.querySelector('.top__departure_time').innerHTML;
            let arrivalData = div.querySelector('.top__arrival_time').innerHTML;
            let tripId = div.querySelector('.trip_id').innerHTML;

            document.getElementById('change_train').value = trainId;
            document.getElementById('change_city').value = destination;

            const [day, month, year] = departureData.substring(0, 10).split('.');
            const [day1, month1, year1] = arrivalData.substring(0, 10).split('.');
            
            document.getElementById('change_departure_date').value = year + '-' + month + '-' + day;
            document.getElementById('change_departure_time').value = departureData.substring(11, 16);
            document.getElementById('change_arrival_date').value = year1 + '-' + month1 + '-' + day1;
            document.getElementById('change_arrival_time').value = arrivalData.substring(11, 16);
            document.getElementById('change__trip_id').innerHTML = tripId;
        }
    });
    let deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(btn => {
        btn.onclick = async function(e){
            let target = e.currentTarget;
            let check = await checkAuth();
            if(!check) window.location.href = 'loginadmin.html';
            else{
                let tripId = target.parentElement.querySelector('.trip_id').innerHTML;       
                let url = `http://127.0.0.1:8080/admin/trip/${tripId}`;
                let response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include'
                });
                if(response.ok){
                    alert('Успешно');
                    getTrips();
                }
                else alert('Ошибка');
            }
        }
    });
}

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
        let container = document.querySelector('.trips');
        container.innerHTML = '';
        json.forEach(trip => {

            let departureTime = trip.departureTime.split(' ')[1].substring(0, 5);
            let arrivalTime = trip.arrivalTime.split(' ')[1].substring(0, 5);

            const [year, month, day] = trip.departureTime.substring(0, 10).split('-');
            const [year1, month1, day1] = trip.arrivalTime.substring(0, 10).split('-');

            let departureDate = new Date(trip.departureTime);
            let arrivalDate = new Date(trip.arrivalTime);

            let diffMs = arrivalDate - departureDate;
            let diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            let diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            let diff = `${diffHrs} ч ${diffMin} м`;
            let now = new Date();
            let str = `<div class="trip">
            <div class="trip__top">
                <p class="top__path">Самара — <span class="destination">${trip.destination}</span></p>
                <p class="top__departure_time">${day}.${month}.${year} ${departureTime}</p>
                <p class="top__duration">${diff}</p>
                <p class="top__arrival_time">${day1}.${month1}.${year1} ${arrivalTime}</p>`;

            if(departureDate.getTime() > now.getTime()) str += `<a href="#izm" class="top__btn change">Изменить рейс</a>
            </div>
            <div class="trip__bottom">
                <div class="bottom__number">${trip.trainId}</div>
                <div class="trip_id" style="display:none;">${trip.tripId}</div>
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
            container.insertAdjacentHTML('beforeend', str);
        });
    }
    setButtons();
}