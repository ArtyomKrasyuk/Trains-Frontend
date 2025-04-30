'use strict'
import { Seat } from "./seat.js";

//let tripId = new URLSearchParams(window.location.search).get('tripId');
let tripId = 1;

let json = null;
let coupes = [];
let platzkarts = [];
let svs = [];
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
            setCuopeCarriage(0);
            let seats1 =  document.querySelectorAll('.coupe__seat');
            let seats2 = document.querySelectorAll('.sv__seat');

            for(let i = 0; i < seats1.length; i++) seats1[i].onclick = selectSeat;
            for(let i = 0; i < seats2.length; i++) seats2[i].onclick = selectSeat;

            if(coupes.length == 0) document.getElementById('coupe').hidden = true;
            if(platzkarts.length == 0) document.getElementById('platzkart').hidden = true;
            if(svs.length == 0) document.getElementById('sv').hidden = true;
            if(seatCarriages.length == 0) document.getElementById('seat_carriage').hidden = true;
        });
    }
}

getSeats();

function setCuopeCarriage(index){
    let carriage = coupes[index];
    let numberOfSeatsCoupe = carriage.numberOfSeats;
    let type = 'Смешанное купе';
    let array = type.split(' ');
    let newType = array[0] + '<br>' + array[1];
    let number = carriage.number;
    let str1 = `<p class="carriage__number">${number} вагон</p>`+
        `<p class="carriage__seats">${numberOfSeatsCoupe} мест</p>`+
        `<p class="carriage__price">2134 - 4234₽</p>`;
    let div1 = document.getElementById('coupe_info');
    div1.insertAdjacentHTML('beforeend', str1);
    if(numberOfSeatsCoupe % 4 == 0){
        for(let i = 0; i < numberOfSeatsCoupe - 1; i+=4){
            if(i == numberOfSeatsCoupe - 4) fillCoupe(carriage, i, newType, true);
            else fillCoupe(carriage, i, newType, false);
        }
    }
}


function fillCoupe(carriage, number, type, last){
    let add = '';
    if(last) add = 'last_coupe';

    let place1 = carriage.places[number];
    let place2 = carriage.places[number+1];
    let place3 = carriage.places[number+2];
    let place4 = carriage.places[number+3];

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">'+
                        `<div class="coupe__seat" data-tooltip="${place1.price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${place1.position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                        '</div>'+
                        `<div class="coupe__seat" data-tooltip="${place2.price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${place2.position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                        ' </div>'+
                        `<div class="coupe__seat" data-tooltip="${place3.price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${place3.position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                        '</div>'+
                        `<div class="coupe__seat" data-tooltip="${place4.price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${place4.position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                        '</div>'+
                    '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('coupe_seats');
    div.insertAdjacentHTML('beforeend', str);
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
    if(e.currentTarget.classList.contains("seat_selected")){
        let seat = new Seat(trainId, carriageNumber, carriageType, seatNumber);
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

    console.log(1);

    selectedSeats.forEach(element =>{
        console.log(element.carriageType);
        if(element.carriageType == 'Купе') coupe.hidden = false;
        else if(element.carriageType == 'Плацкарт') platzkart.hidden = false;
        else if(element.carriageType == 'СВ') sv.hidden = false;
        else seat_carriage.hidden = false;
    })
}