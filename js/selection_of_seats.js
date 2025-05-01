'use strict'
import { Seat } from "./seat.js";

//let tripId = new URLSearchParams(window.location.search).get('tripId');
let tripId = 1;

let json = null;
let coupesIndex = 0;
let coupes = [];
let platzkartsIndex = 0;
let platzkarts = [];
let svsIndex = 0;
let svs = [];
let seatCarriagesIndex = 0;
let seatCarriages = [];
let trainId = 0;

let selectedSeats = [];

document.getElementById('coupe_btn').hidden = true;
document.getElementById('platzkart_btn').hidden = true;
document.getElementById('sv_btn').hidden = true;
document.getElementById('seat_carriage_btn').hidden = true;

async function getSeats(){
    let url = `http://127.0.0.1:8080/trip/${tripId}`;
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    if(response.ok){
        let body = await response.text();
        json = JSON.parse(body);
        trainId = json.trainId;
        json.carriages.forEach(element => {
            if(element.type == 'Купе') coupes.push(element);
            else if(element.type == 'Плацкарт') platzkarts.push(element);
            else if(element.type == 'СВ') svs.push(element);
            else seatCarriages.push(element);
            if(coupes.length != 0) setCuopeCarriage(0);
            let seats1 =  document.querySelectorAll('.coupe__seat');
            let seats2 = document.querySelectorAll('.sv__seat');

            for(let i = 0; i < seats1.length; i++) {
                if(!seats1[i].classList.contains("booked_seat")) seats1[i].onclick = selectSeat;
            }
            for(let i = 0; i < seats2.length; i++) {
                if(!seats2[i].classList.contains("booked_seat")) seats2[i].onclick = selectSeat;
            }

            if(coupes.length == 0) {
                document.getElementById('coupe').hidden = true;
                document.getElementById('coupe_a').hidden = true;
            }
            if(platzkarts.length == 0) {
                document.getElementById('platzkart').hidden = true;
                document.getElementById('platzkart_a').hidden = true;
            }
            if(svs.length == 0) {
                document.getElementById('sv').hidden = true;
                document.getElementById('sv_a').hidden = true;
            }
            if(seatCarriages.length == 0) {
                document.getElementById('seat_carriage').hidden = true;
                document.getElementById('seat_carriage_a').hidden = true;
            }

            let coupeMinPrice = 100000000;
            coupes.forEach(coupe=>{
                coupe.places.forEach(place=>{
                    if(place.price < coupeMinPrice) coupeMinPrice = place.price;
                });
            });
            document.getElementById("coupe_a").innerHTML = '<p class="option__title">Купе</p>' + `<p class="option__price">от ${coupeMinPrice}₽</p>`;
            setArrows();
        });
    }
}

getSeats();


function setArrows(){
    let coupe_left = document.getElementById("coupe_arrow_left");
    let coupe_right = document.getElementById("coupe_arrow_right");
    let platzkart_left = document.getElementById("platzkart_arrow_left");
    let platzkart_right = document.getElementById("platzkart_arrow_right");
    let sv_left = document.getElementById("sv_arrow_left");
    let sv_right = document.getElementById("sv_arrow_right");
    let seat_carriage_left = document.getElementById("seat_carriage_arrow_left");
    let seat_carriage_right = document.getElementById("seat_carriage_arrow_right");

    coupe_left.hidden = false;
    coupe_right.hidden = false;
    platzkart_left.hidden = false;
    platzkart_right.hidden = false;
    sv_left.hidden = false;
    sv_right.hidden = false;
    seat_carriage_left.hidden = false;
    seat_carriage_right.hidden = false;


    if(coupesIndex == 0) coupe_left.hidden = true;
    if(coupesIndex == coupes.length - 1) coupe_right.hidden = true;
    if(platzkartsIndex == 0) platzkart_left.hidden = true;
    if(platzkartsIndex == platzkarts.length - 1) platzkart_right.hidden = true;
    if(svsIndex == 0) sv_left.hidden = true;
    if(svsIndex == svs.length - 1) sv_right.hidden = true;
    if(seatCarriagesIndex == 0) seat_carriage_left.hidden = true;
    if(seatCarriagesIndex == seatCarriages.length - 1) seat_carriage_right.hidden = true;
    
    coupe_right.onclick = function(e){
        coupesIndex++;
        setCuopeCarriage(coupesIndex);
        setArrows();
    }
    coupe_left.onclick = function(e){
        coupesIndex--;
        setCuopeCarriage(coupesIndex);
        setArrows();
    }
}

function setCuopeCarriage(index){
    let carriage = coupes[index];
    let numberOfSeatsCoupe = carriage.numberOfSeats;
    let type = 'Смешанное купе';
    let array = type.split(' ');
    let number = carriage.number;
    let minPrice = 10000000;
    let maxPrice = 0;
    carriage.places.forEach(place=>{
        if(place.price < minPrice) minPrice = place.price;
        if(place.price > maxPrice) maxPrice = place.price;
    })
    let str1 = `<p class="carriage__number">${number} вагон</p>`+
        `<p class="carriage__seats">${numberOfSeatsCoupe} мест</p>`+
        `<p class="carriage__price">${minPrice} - ${maxPrice}₽</p>`;
    let div = document.getElementById('coupe_seats');
    div.innerHTML = '';
    let div1 = document.getElementById('coupe_info');
    div1.innerHTML= '';
    div1.insertAdjacentHTML('beforeend', str1);
    if(numberOfSeatsCoupe % 4 == 0){
        for(let i = 0; i < numberOfSeatsCoupe - 1; i+=4){
            if(i == numberOfSeatsCoupe - 4) fillCoupe(carriage, i, true);
            else fillCoupe(carriage, i, false);
        }
    }
}


function fillCoupe(carriage, number, last){
    let add = '';
    if(last) add = 'last_coupe';
    let places = [];
    places.push(carriage.places[number]);
    places.push(carriage.places[number+1]);
    places.push(carriage.places[number+2]);
    places.push(carriage.places[number+3]);

    let type = getCoupeType(places);

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">';
    for(let i = 0; i < 4; i++){
        let pos = '';
        if(i == 0 || i == 1) pos = 'верхнее';
        else pos = 'нижнее';
        
        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position = seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            str += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, ${pos}">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
            continue;
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        str += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, ${pos}">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
    }

    str += '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('coupe_seats');
    div.insertAdjacentHTML('beforeend', str);
}

function getCoupeType(places){
    let male = 0;
    let female = 0;
    for(let i = 0; i < places.length; i++){
        if(places[i].gender == 1) male++;
        else if(places[i].gender == 2) female++;
    }
    if(male == places.length) return 'Мужское<br>купе';
    else if(female == places.length) return 'Женское<br>купе';
    else return 'Смешанное<br>купе';
}

let type = 'Смешанное купе';
let array = type.split(' ');
let newType = array[0] + '<br>' + array[1];

/*
// response body
let numberOfSeatsCoupe = 36;
let type = 'Смешанное купе';
let array = type.split(' ');
let newType = array[0] + '<br>' + array[1];
let str1 = `<p class="carriage__number">12 вагон</p>`+
    `<p class="carriage__seats">${numberOfSeatsCoupe} мест</p>`+
    `<p class="carriage__price">2134 - 4234₽</p>`;
let div1 = document.getElementById('coupe_info');
div1.insertAdjacentHTML('beforeend', str1);
if(numberOfSeatsCoupe % 4 == 0){
    for(let i = 1; i < numberOfSeatsCoupe; i+=4){
        if(i == numberOfSeatsCoupe - 3) fillCoupe(i, newType, true);
        else fillCoupe(i, newType, false);
    }
}*/



// response body
let numberOfSeatsPlatzkart = 60;
let str2 = `<p class="carriage__number">12 вагон</p>`+
    `<p class="carriage__seats">${numberOfSeatsPlatzkart} мест</p>`+
    `<p class="carriage__price">2134₽</p>`;
let div2 = document.getElementById('platzkart_info');
div2.insertAdjacentHTML('beforeend', str2);
if(numberOfSeatsPlatzkart % 6 == 0){
    for(let i = 1; i < numberOfSeatsPlatzkart; i+=6){
        if(i == numberOfSeatsPlatzkart - 5) fillPlatzkart(i, true);
        else fillPlatzkart(i, false);
    }
}



// response body
let numberOfSeatsSV = 20;
let str3 = `<p class="carriage__number">12 вагон</p>`+
    `<p class="carriage__seats">${numberOfSeatsSV} мест</p>`+
    `<p class="carriage__price">4234₽</p>`;
let div3 = document.getElementById('sv_info');
div3.insertAdjacentHTML('beforeend', str3);
if(numberOfSeatsSV % 2 == 0){
    for(let i = 1; i < numberOfSeatsSV; i+=2){
        if(i == numberOfSeatsSV - 1) fillSV(i, newType, true);
        else fillSV(i, newType, false);
    }
}



// response body
let numberOfSeatsSeatCarriage = 96;
let block1 = 3;
let block2 = 3;
let str4 = `<p class="carriage__number">12 вагон</p>`+
    `<p class="carriage__seats">${numberOfSeatsSeatCarriage} мест</p>`+
    `<p class="carriage__price">4234₽</p>`;
let div4= document.getElementById('seat_carriage_info');
div4.insertAdjacentHTML('beforeend', str4);
if(numberOfSeatsSeatCarriage % (block1 + block2) == 0){
    for(let i = 1; i < numberOfSeatsSeatCarriage; i+=(block1 + block2)){
        fillSeatCarriage(i, block1, block2);
    }
}


function fillPlatzkart(number, last){
    let add = '';
    let addBottom = '';
    if(last) {
        add = 'last_coupe';
        addBottom = 'last_coupe_bottom';
    }

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">'+
                        '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${number+1}</p>`+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                                '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                                `<p class="seat__number_top number">${number+3}</p>`+
                        ' </div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, нижнее">'+
                            `<p class="seat__number_bottom number">${number}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, нижнее">'+
                            `<p class="seat__number_bottom number">${number+2}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
    let div = document.getElementById('platzkart_seats');
    div.insertAdjacentHTML('beforeend', str);

    let str1 = 
    '<div class="coupe__wrapper">'+
        `<div class="coupe_bottom ${addBottom}">`+
            '<div class="coupe__seats_bottom">'+
                '<div class="coupe__seat" data-tooltip="2134₽, нижнее">'+
                    `<p class="seat__number_bottom number">${number+4}</p>`+
                    '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
            '</div>'+
                '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                    '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                    `<p class="seat__number_top number">${number+5}</p>`+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    let div1 = document.getElementById('platzkart_bottom_seats');
    div1.insertAdjacentHTML('beforeend', str1);
}

function fillSV(number, type, last){
    let add = '';
    if(last) add = 'last_coupe';

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">'+
                        '<div class="sv__seat" data-tooltip="4234₽">'+
                            `<p class="seat__number_sv number">${number}</p>`+
                        '</div>'+
                        '<div class="sv__seat" data-tooltip="4234₽">'+
                            `<p class="seat__number_sv number">${number+1}</p>`+
                        ' </div>'+
                    '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('sv_seats');
    div.insertAdjacentHTML('beforeend', str);
}

function fillSeatCarriage(number, block1, block2){
    let str6 = '<div class="seat_block">';
    for(let i = 0; i < block1; i++){
        str6 += '<div class="coupe__seat" data-tooltip="2134₽">'+
                    `<p class="seat__number number">${number+i}</p>`+
               ' </div>';
    }
    str6 += '</div>'

    let str7 = '<div class="seat_block bottom_block">';
    for(let i = 0; i < block2; i++){
        str7 += '<div class="coupe__seat" data-tooltip="2134₽">'+
                    `<p class="seat__number number">${number+block1+i}</p>`+
               ' </div>';
    }
    str7 += '</div>';

    let div6 = document.getElementById('seat_carriage_seats');
    div6.insertAdjacentHTML('beforeend', str6);
    let div7 = document.getElementById('seat_carriage_bottom_seats');
    div7.insertAdjacentHTML('beforeend', str7);
}

function selectSeat(e){
    e.currentTarget.classList.toggle("seat_selected");
    let seatNumber = parseInt(e.currentTarget.querySelector('.number').innerHTML);
    let carriageNumber = parseInt(e.currentTarget.querySelector('.carriage_number').innerHTML);
    let carriageType = e.currentTarget.querySelector('.carriage_type').innerHTML;
    let price = parseInt(e.currentTarget.querySelector('.price').innerHTML);
    if(e.currentTarget.classList.contains("seat_selected")){
        let seat = new Seat(trainId, carriageNumber, carriageType, seatNumber, price);
        selectedSeats.push(seat);
        checkButtons();
    }
    else{
        for(let i = 0; i < selectedSeats.length; i++){
            if(selectedSeats[i].carriageNumber == carriageNumber && selectedSeats[i].seatNumber == seatNumber) selectedSeats.splice(i, 1);
        }
        checkButtons();
    }

}

function checkButtons(){
    let coupe = document.getElementById('coupe_btn');
    let platzkart = document.getElementById('platzkart_btn');
    let sv = document.getElementById('sv_btn');
    let seat_carriage = document.getElementById('seat_carriage_btn');

    coupe.hidden = true;
    platzkart.hidden = true;
    sv.hidden = true;
    seat_carriage.hidden = true;

    selectedSeats.forEach(element =>{
        if(element.carriageType == 'Купе') coupe.hidden = false;
        else if(element.carriageType == 'Плацкарт') platzkart.hidden = false;
        else if(element.carriageType == 'СВ') sv.hidden = false;
        else seat_carriage.hidden = false;
    })
}