'use strict'
import { Seat } from "./seat.js";

//let tripId = new URLSearchParams(window.location.search).get('tripId');
let tripId = 3;

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
        });
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
        if(coupes.length != 0) setCuopeCarriage(0);
        if(platzkarts.length != 0) setPlatzkartCarriage(0);
        if(svs.length != 0) setSvCarriage(0);
        if(seatCarriages.length != 0) setSeatCarriage(0);

        let coupeMinPrice = 100000000;
        coupes.forEach(coupe=>{
            coupe.places.forEach(place=>{
                if(place.price < coupeMinPrice) coupeMinPrice = place.price;
            });
        });
        document.getElementById("coupe_a").innerHTML = '<p class="option__title">Купе</p>' + `<p class="option__price">от ${coupeMinPrice}₽</p>`;
        let platzkartMinPrice = 100000000;
        platzkarts.forEach(platzkart=>{
            platzkart.places.forEach(place=>{
                if(place.price < platzkartMinPrice) platzkartMinPrice = place.price;
            });
        });
        document.getElementById("platzkart_a").innerHTML = '<p class="option__title">Плацкарт</p>' + `<p class="option__price">от ${platzkartMinPrice}₽</p>`;
        let svMinPrice = 100000000;
        svs.forEach(sv=>{
            sv.places.forEach(place=>{
                if(place.price < svMinPrice) svMinPrice = place.price;
            });
        });
        document.getElementById("sv_a").innerHTML = '<p class="option__title">СВ</p>' + `<p class="option__price">от ${svMinPrice}₽</p>`;
        let seatCarriageMinPrice = 100000000;
        seatCarriages.forEach(seatCarriage=>{
            seatCarriage.places.forEach(place=>{
                if(place.price < seatCarriageMinPrice) seatCarriageMinPrice = place.price;
            });
        });
        document.getElementById("seat_carriage_a").innerHTML = '<p class="option__title">Сидячий</p>' + `<p class="option__price">от ${seatCarriageMinPrice}₽</p>`;
        setArrows();
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
    platzkart_right.onclick = function(e){
        platzkartsIndex++;
        setPlatzkartCarriage(platzkartsIndex);
        setArrows();
    }
    platzkart_left.onclick = function(e){
        platzkartsIndex--;
        setPlatzkartCarriage(platzkartsIndex);
        setArrows();
    }
    sv_right.onclick = function(e){
        svsIndex++;
        setSvCarriage(svsIndex);
        setArrows();
    }
    sv_left.onclick = function(e){
        svsIndex--;
        setSvCarriage(svsIndex);
        setArrows();
    }
    seat_carriage_right.onclick = function(e){
        seatCarriagesIndex++;
        setSeatCarriage(seatCarriagesIndex);
        setArrows();
    }
    seat_carriage_left.onclick = function(e){
        seatCarriagesIndex--;
        setSeatCarriage(seatCarriagesIndex);
        setArrows();
    }
}

function setCuopeCarriage(index){
    let carriage = coupes[index];
    let numberOfSeatsCoupe = carriage.numberOfSeats;
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
        for(let i = 0; i < numberOfSeatsCoupe; i+=4){
            if(i == numberOfSeatsCoupe - 4) fillCoupe(carriage, i, true);
            else fillCoupe(carriage, i, false);
        }
    }
    let seats1 =  document.querySelectorAll('.coupe__seat');
    for(let i = 0; i < seats1.length; i++) {
        if(!seats1[i].classList.contains("booked_seat")) seats1[i].onclick = selectSeat;
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
        
        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            if(i == 0 || i == 1){
                str += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
            else{
                str += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        if(i == 0 || i == 1){
            str += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
        else{
            str += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
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

function setPlatzkartCarriage(index){
    let carriage = platzkarts[index]
    let numberOfSeatsPlatzkart = carriage.numberOfSeats;
    let number = carriage.number;
    let minPrice = 10000000;
    let maxPrice = 0;
    carriage.places.forEach(place=>{
        if(place.price < minPrice) minPrice = place.price;
        if(place.price > maxPrice) maxPrice = place.price;
    })
    let str2 = `<p class="carriage__number">${number} вагон</p>`+
        `<p class="carriage__seats">${numberOfSeatsPlatzkart} мест</p>`+
        `<p class="carriage__price">${minPrice} - ${maxPrice}₽</p>`;
    let div = document.getElementById('platzkart_seats');
    div.innerHTML = '';
    let div1 = document.getElementById('platzkart_bottom_seats');
    div1.innerHTML = '';
    let div2 = document.getElementById('platzkart_info');
    div2.innerHTML = '';
    div2.insertAdjacentHTML('beforeend', str2);
    if(numberOfSeatsPlatzkart % 6 == 0){
        for(let i = 0; i < numberOfSeatsPlatzkart; i+=6){
            if(i == numberOfSeatsPlatzkart - 6) fillPlatzkart(carriage, i, true);
            else fillPlatzkart(carriage, i, false);
        }
    }
    let seats1 =  document.querySelectorAll('.coupe__seat');
    for(let i = 0; i < seats1.length; i++) {
        if(!seats1[i].classList.contains("booked_seat")) seats1[i].onclick = selectSeat;
    }
}

function fillPlatzkart(carriage, number, last){
    let add = '';
    let addBottom = '';
    if(last) {
        add = 'last_coupe';
        addBottom = 'last_coupe_bottom';
    }
    let places = [];
    places.push(carriage.places[number]);
    places.push(carriage.places[number+1]);
    places.push(carriage.places[number+2]);
    places.push(carriage.places[number+3]);
    places.push(carriage.places[number+4]);
    places.push(carriage.places[number+5]);


    let str = '<div class="coupe__wrapper">'+
        `<div class="coupe ${add}">`+
            '<div class="coupe__seats">';
    for(let i = 0; i < 4; i++){

        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            if(i == 0 || i == 1){
                str += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
            else{
                str += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        if(i == 0 || i == 1){
            str += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
        else{
            str += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
    }

    str += '</div>'+
        '</div>'+
    '</div>';
    let div = document.getElementById('platzkart_seats');
    div.insertAdjacentHTML('beforeend', str);

    let str1 = 
    '<div class="coupe__wrapper">'+
        `<div class="coupe_bottom ${addBottom}">`+
            '<div class="coupe__seats_bottom">';
    for(let i = 4; i < 6; i++){
        let pos = '';
        if(i == 4) pos = 'нижнее';
        else pos = 'верхнее';

        let selected = false;
        selectedSeats.forEach(seat =>{
        if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            if(i == 5){
                str1 += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
            else{
                str1 += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
            }
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        if(i == 5){
            str1 += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, верхнее">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
        else{
            str1 += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽, нижнее">`+
                            `<p class="seat__number_bottom number">${places[i].position}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
        }
    }
    str1 += '</div>'+
        '</div>'+
    '</div>';
    let div1 = document.getElementById('platzkart_bottom_seats');
    div1.insertAdjacentHTML('beforeend', str1);
}

function setSvCarriage(index){
    let carriage = svs[index];
    let numberOfSeatsSV = carriage.numberOfSeats;
    let number = carriage.number;
    let minPrice = 10000000;
    let maxPrice = 0;
    carriage.places.forEach(place=>{
        if(place.price < minPrice) minPrice = place.price;
        if(place.price > maxPrice) maxPrice = place.price;
    })
    let str1 = `<p class="carriage__number">${number} вагон</p>`+
        `<p class="carriage__seats">${numberOfSeatsSV} мест</p>`+
        `<p class="carriage__price">${minPrice} - ${maxPrice}₽</p>`;
    let div = document.getElementById('sv_seats');
    div.innerHTML = '';
    let div1 = document.getElementById('sv_info');
    div1.innerHTML= '';
    div1.insertAdjacentHTML('beforeend', str1);
    if(numberOfSeatsSV % 2 == 0){
        for(let i = 0; i < numberOfSeatsSV; i+=2){
            if(i == numberOfSeatsSV - 2) fillSV(carriage, i, true);
            else fillSV(carriage, i, false);
        }
    }
    let seats2 = document.querySelectorAll('.sv__seat');
    for(let i = 0; i < seats2.length; i++) {
        if(!seats2[i].classList.contains("booked_seat")) seats2[i].onclick = selectSeat;
    }
}

function fillSV(carriage, number, last){
    let add = '';
    if(last) add = 'last_coupe';
    let places = [];
    places.push(carriage.places[number]);
    places.push(carriage.places[number+1]);

    let type = getCoupeType(places);

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">';
    for(let i = 0; i < 2; i++){
        
        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            str += `<div class="sv__seat seat_selected" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number_sv number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        str += `<div class="sv__seat ${booked}" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number_sv number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
    }
    str +=        '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('sv_seats');
    div.insertAdjacentHTML('beforeend', str);
}

function setSeatCarriage(index){
    let carriage = seatCarriages[index];
    let block1 = carriage.topBlockWidth;
    let block2 = carriage.bottomBlockWidth;
    let numberOfSeatsSeatCarriage = carriage.numberOfSeats;
    let number = carriage.number;
    let minPrice = 10000000;
    let maxPrice = 0;
    carriage.places.forEach(place=>{
        if(place.price < minPrice) minPrice = place.price;
        if(place.price > maxPrice) maxPrice = place.price;
    })
    let str1 = `<p class="carriage__number">${number} вагон</p>`+
        `<p class="carriage__seats">${numberOfSeatsSeatCarriage} мест</p>`+
        `<p class="carriage__price">${minPrice} - ${maxPrice}₽</p>`;
    let div = document.getElementById('seat_carriage_seats');
    div.innerHTML = '';
    let div1 = document.getElementById('seat_carriage_info');
    div1.innerHTML= '';
    let div2 = document.getElementById('seat_carriage_bottom_seats');
    div2.innerHTML = '';
    div1.insertAdjacentHTML('beforeend', str1);
    if(numberOfSeatsSeatCarriage % (block1 + block2) == 0){
        for(let i = 0; i < numberOfSeatsSeatCarriage; i+=(block1 + block2)){
            fillSeatCarriage(carriage, i, block1, block2);
        }
    }
    let seats1 =  document.querySelectorAll('.coupe__seat');
    for(let i = 0; i < seats1.length; i++) {
        if(!seats1[i].classList.contains("booked_seat")) seats1[i].onclick = selectSeat;
    }
}

function fillSeatCarriage(carriage, number, block1, block2){
    let places = [];
    for(let i = 0; i < block1+block2; i++) places.push(carriage.places[number+i]);

    let str6 = '<div class="seat_block">';
    for(let i = 0; i < block1; i++){
        
        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            str6 += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        str6 += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
    }
    str6 += '</div>'

    let str7 = '<div class="seat_block bottom_block">';
    for(let i = block1; i < block1+block2; i++){
        
        let selected = false;
        selectedSeats.forEach(seat =>{
            if(places[i].position == seat.seatNumber && carriage.number == seat.carriageNumber) selected = true;
        })

        if(selected){
            str7 += `<div class="coupe__seat seat_selected" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
                continue;
        }

        let booked = '';
        if(places[i].booked) booked = 'booked_seat';
        str7 += `<div class="coupe__seat ${booked}" data-tooltip="${places[i].price}₽">`+
                            `<p class="seat__number number">${places[i].position}</p>`+
                            `<p class="carriage_number" style="display: none;">${carriage.number}</p>`+
                            `<p class="carriage_type" style="display: none;">${carriage.type}</p>`+
                            `<p class="price" style="display: none;">${places[i].price}</p>`+
                        '</div>';
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