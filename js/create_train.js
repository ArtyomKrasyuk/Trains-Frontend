'use strict'

class Carriage{
    constructor(number, type, coupe, row, topBlock, bottomBlock){
        this.number = number;
        this.type = type;
        this.coupe = coupe;
        this.row = row;
        this.topBlock = topBlock;
        this.bottomBlock = bottomBlock;
    }
}

document.getElementById('train_number').addEventListener('input', function(e){
    this.value = this.value.replace(/\D/g, '');
});

document.querySelector('.carriage_number__input').addEventListener('input', function(e){
    this.value = this.value.replace(/\D/g, '');
});

let inputs = document.querySelectorAll('.number__input');
inputs.forEach(inp => {
    inp.addEventListener('input', function(e){
        this.value = this.value.replace(/\D/g, '');
    });
});

function checkInputs(){
    let coupe_input = document.getElementById('coupe_input');
    let row_input = document.getElementById('row_input');
    let top_block_input = document.getElementById('top_block_input');
    let bottom_block_input = document.getElementById('bottom_block_input');

    let platzkart = document.getElementById('platzkart');
    let seat_carriage = document.getElementById('seat_carriage');
    let coupe = document.getElementById('coupe');
    let sv = document.getElementById('sv');

    let num = document.querySelector('.carriage_number__input');


    let flag = true;

    if(coupe.checked){
        if(coupe_input.value == ''){
            alert('Колчество купе должно быть заполнено');
            flag = false;
        }
        else{
            let val = parseInt(coupe_input.value);
            if(val < 3 || val > 9){
                alert('Количество купе должно быть от 3 до 9');
                flag = false;
            }
        }
    }
    else if(platzkart.checked){
        if(coupe_input.value == ''){
            alert('Колчество купе должно быть заполнено');
            flag = false;
        }
        else{
            let val = parseInt(coupe_input.value);
            if(val < 9 || val > 10){
                alert('Количество купе должно быть от 9 до 10');
                flag = false;
            }
        }
    }
    else if(sv.checked){
        if(coupe_input.value == ''){
            alert('Колчество купе должно быть заполнено');
            flag = false;
        }
        else{
            let val = parseInt(coupe_input.value);
            if(val < 8 || val > 10){
                alert('Количество купе должно быть от 8 до 10');
                flag = false;
            }
        }
    }
    else if(seat_carriage.checked){
        if(row_input.value == '' || top_block_input.value == '' || bottom_block_input.value == ''){
            alert('Все поля с характеристиками сидячего вагона должны быть заполнены');
            flag = false;
        }
        else{
            let row = parseInt(row_input.value);
            let top = parseInt(top_block_input.value);
            let bottom = parseInt(bottom_block_input.value);
            if(row < 13 || row > 16){
                alert('Количество блоков в ряду должно быть от 13 до 16');
                flag = false;
            }
            if(top < 1 || top > 3 || bottom < 1 || bottom > 3){
                alert('Количество мест в блоке должно быть от 1 до 3');
                flag = false;
            }
        }
    }

    if(num.value == ''){
        alert('Необходимо указать номер вагона');
        flag = false;
    }
    else{
        if(num.value < 1 || num.value > 20){
            alert('Номер вагона может быть от 1 до 20');
            flag = false;
        }
    }

    return flag;
}

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

async function checkAdmin(){
    let check = await checkAuth();
    if(!check) window.location.href = 'loginadmin.html';
}

let trainNumber = new URLSearchParams(window.location.search).get('trainNumber');

let carriages = [];

document.getElementById('create').hidden = true;

if(trainNumber != 'new'){
    document.getElementById('train_number').value = trainNumber;
    document.getElementById('train_number').disabled = true;
    fillArray();
}
else{
    checkAdmin();
}

async function fillArray(){
    let check = await checkAuth();
    if(!check) window.location.href = 'loginadmin.html';
    else{
        let trainId = parseInt(document.getElementById('train_number').value);
        let url = `http://127.0.0.1:8080/train/${trainId}`;
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: 'include'
        });
        if(response.ok){
            let body = await response.json();
            body.carriages.forEach(carriage=>{
                let coupe = 0;
                let row = 0;
                if(carriage.type == 'Купе') coupe = carriage.numberOfSeats / 4;
                else if(carriage.type == 'Плацкарт') coupe = carriage.numberOfSeats / 6;
                else if(carriage.type == 'СВ') coupe = carriage.numberOfSeats / 2;
                else row = carriage.numberOfSeats / (carriage.topBlockWidth + carriage.bottomBlockWidth);
                let obj = new Carriage(carriage.number, carriage.type, coupe, row, carriage.topBlockWidth, carriage.bottomBlockWidth);
                carriages.push(obj);
            });
            getSeats();
        }
        else alert('Не удалось загрузить поезд');
    }
}

let numberInput = document.querySelector('.carriage_number__input');
numberInput.value = 1;

let coupeData = document.getElementById('coupe_data');
let rowData = document.getElementById('row_data');
let topBlockData = document.getElementById('top_block_data');
let bottomBlockData = document.getElementById('bottom_block_data');

let coupeInput = document.getElementById('coupe_input');
let rowInput = document.getElementById('row_input');
let topBlockInput = document.getElementById('top_block_input');
let bottomBlockInput = document.getElementById('bottom_block_input');

let container = document.querySelector('.carriages');

coupeData.hidden = true;
rowData.hidden = true;
topBlockData.hidden = true;
bottomBlockData.hidden = true;

function checkTrain(){
    let num = document.getElementById('train_number').value;
    let flag = true;
    if(num == ''){
        alert('Необходимо указать номер поезда');
        flag = false;
    }
    else{
        let numInt = parseInt(num);
        if(numInt < 1 || numInt > 96){
            alert('Номер поезда может быть от 1 до 96');
            flag = false;
        }
    }

    if(carriages.length == 0){
        alert('Поезд должен содержать вагоны');
        flag = false;
    }
    else{
        for(let i = 0; i < carriages.length; i++){
            console.log(i);
            console.log(carriages[i]);
            if(i == 0){
                if(carriages[0].number != 1){
                    alert('Нумерация вагонов должна начинаться с 1');
                    flag = false;
                }
            }
            else{
                if(carriages[i].number != carriages[i-1].number + 1){
                    alert('Нумерация вагонов должна идти по порядку');
                    flag = false;
                }
            }
        }
    }
    return flag;
}

document.getElementById('create').onclick = async function(e){
    let check = await checkAuth();
    if(!check) window.location.href = 'loginadmin.html';
    else{
        let res = checkTrain();
        if(!res) return;

        let trainId = parseInt(document.getElementById('train_number').value);
        if(trainId == 0) return;
        let carriagesArray = [];
        carriages.forEach(carriage =>{
            if(carriage.type == 'Купе'){
                let placesArray = [];
                let numberOfSeats = carriage.coupe * 4;
                for(let i = 1; i < numberOfSeats; i+=4){
                    let gender = 0;
                    if(i == 1) gender = 2;
                    else if(i == numberOfSeats - 3) gender = 1;
                    placesArray.push({
                        'position': i,
                        'comfortFactor': 1.5,
                        'gender': gender,
                    });
                    placesArray.push({
                        'position': i+1,
                        'comfortFactor': 1.5,
                        'gender': gender,
                    });
                    placesArray.push({
                        'position': i+2,
                        'comfortFactor': 1,
                        'gender': gender,
                    });
                    placesArray.push({
                        'position': i+3,
                        'comfortFactor': 1,
                        'gender': gender,
                    });
                }
                let carriageObj = {
                    'number': carriage.number,
                    'type': carriage.type,
                    'numberOfSeats': numberOfSeats,
                    'topBlockWidth': 0,
                    'bottomBlockWidth': 0,
                    'places': placesArray
                }
                carriagesArray.push(carriageObj);
            }
            else if(carriage.type == 'Плацкарт'){
                let placesArray = [];
                let numberOfSeats = carriage.coupe * 6;
                for(let i = 1; i < numberOfSeats; i+=6){
                    placesArray.push({
                        'position': i,
                        'comfortFactor': 1.5,
                        'gender': 0,
                    });
                    placesArray.push({
                        'position': i+1,
                        'comfortFactor': 1.5,
                        'gender': 0,
                    });
                    placesArray.push({
                        'position': i+2,
                        'comfortFactor': 1,
                        'gender': 0,
                    });
                    placesArray.push({
                        'position': i+3,
                        'comfortFactor': 1,
                        'gender': 0,
                    });
                    placesArray.push({
                        'position': i+4,
                        'comfortFactor': 1,
                        'gender': 0,
                    });
                    placesArray.push({
                        'position': i+5,
                        'comfortFactor': 1.5,
                        'gender': 0,
                    });
                }
                let carriageObj = {
                    'number': carriage.number,
                    'type': carriage.type,
                    'numberOfSeats': numberOfSeats,
                    'topBlockWidth': 0,
                    'bottomBlockWidth': 0,
                    'places': placesArray
                }
                carriagesArray.push(carriageObj);
            }
            else if(carriage.type == 'СВ'){
                let placesArray = [];
                let numberOfSeats = carriage.coupe * 2;
                for(let i = 1; i < numberOfSeats; i+=2){
                    let gender = 0;
                    if(i == 1) gender = 2;
                    else if(i == numberOfSeats - 1) gender = 1;
                    placesArray.push({
                        'position': i,
                        'comfortFactor': 1,
                        'gender': gender,
                    });
                    placesArray.push({
                        'position': i+1,
                        'comfortFactor': 1,
                        'gender': gender,
                    });
                }
                let carriageObj = {
                    'number': carriage.number,
                    'type': carriage.type,
                    'numberOfSeats': numberOfSeats,
                    'topBlockWidth': 0,
                    'bottomBlockWidth': 0,
                    'places': placesArray
                }
                carriagesArray.push(carriageObj);
            }
            else{
                let placesArray = [];
                let numberOfSeats = (carriage.topBlock + carriage.bottomBlock) * carriage.row;
                for(let i = 1; i <= numberOfSeats; i+=1){
                    placesArray.push({
                        'position': i,
                        'comfortFactor': 1,
                        'gender': 0,
                    });
                }
                let carriageObj = {
                    'number': carriage.number,
                    'type': carriage.type,
                    'numberOfSeats': numberOfSeats,
                    'topBlockWidth': carriage.topBlock,
                    'bottomBlockWidth': carriage.bottomBlock,
                    'places': placesArray
                }
                carriagesArray.push(carriageObj);
            }
        });
        let trainObj = {
            'trainId': trainId,
            'trainName': 'Поезд',
            'carriages': carriagesArray
        }
        let url = 'http://127.0.0.1:8080/admin/add-train';
        let method = 'POST';
        if(trainNumber != 'new') {
            url = 'http://127.0.0.1:8080/admin/change-train';
            method = 'PATCH';
        }
        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(trainObj),
            credentials: 'include'
        });
        if(response.ok) window.location.href = 'admin_trains.html';
        else if(response.status == 500){
            let text = await response.text();
            alert(text);
        }
        else alert('Ошибка');
    }
}

const radioButtons = document.querySelectorAll('input[name="type"]');
radioButtons.forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.checked) {
      if(this.value != 'seat_carriage'){
        coupeData.hidden = false;
        rowData.hidden = true;
        topBlockData.hidden = true;
        bottomBlockData.hidden = true;
      }
      else{
        coupeData.hidden = true;
        rowData.hidden = false;
        topBlockData.hidden = false;
        bottomBlockData.hidden = false;
      }
    }
  });
});

document.getElementById('append_carriage').onclick = function(e){
    let res = checkInputs();
    if(!res) return;

    let number = parseInt(numberInput.value);
    let coupe = document.getElementById('coupe');
    let platzkart = document.getElementById('platzkart');
    let seat_carriage = document.getElementById('seat_carriage');
    let sv = document.getElementById('sv');
    let type = '';
    let obj = null;
    if(coupe.checked){
        type = 'Купе';
        obj = new Carriage(number, type, parseInt(coupeInput.value), parseInt(rowInput.value), parseInt(topBlockInput.value), parseInt(bottomBlockInput.value));
    }
    else if(platzkart.checked){
        type = 'Плацкарт';
        obj = new Carriage(number, type, parseInt(coupeInput.value), parseInt(rowInput.value), parseInt(topBlockInput.value), parseInt(bottomBlockInput.value));
    }
    else if(seat_carriage.checked){
        type = 'Сидячий';
        obj = new Carriage(number, type, parseInt(coupeInput.value), parseInt(rowInput.value), parseInt(topBlockInput.value), parseInt(bottomBlockInput.value));
    }
    else if(sv.checked){
        type = 'СВ';
        obj = new Carriage(number, type, parseInt(coupeInput.value), parseInt(rowInput.value), parseInt(topBlockInput.value), parseInt(bottomBlockInput.value));
    }

    /*
    if(carriages[number-1] != null && carriages[number-1].number == number) carriages.splice(number-1, 1);
    carriages.splice(number-1, 0, obj);
    */
    if(carriages.length == 0) carriages.push(obj);
    else{
        for(let i = 0; i < carriages.length; i++){
            if(carriages[i].number > obj.number) {
                carriages.splice(i, 0, obj);
                break;
            }
            else if(carriages[i].number == obj.number){
                carriages[i] = obj;
                break;
            }
            else{
                if(i == carriages.length - 1){
                    carriages.push(obj);
                    break;
                }
                else continue;
            }
        }
    }


    getSeats();
    numberInput.value = number+1;
}

function getSeats(){
    document.querySelector('.carriages').innerHTML = '';
    let create_btn = document.getElementById('create');
    create_btn.hidden = true;
    if(carriages.length != 0) create_btn.hidden = false;
    carriages.forEach(obj=>{
        if(obj.type == 'Купе'){
            setCuopeCarriage(obj.coupe, obj.number);
        }
        else if(obj.type == 'Плацкарт') setPlatzkartCarriage(obj.coupe, obj.number);
        else if(obj.type == 'СВ') setSvCarriage(obj.coupe, obj.number);
        else{
            setSeatCarriage(obj.row, obj.topBlock, obj.bottomBlock, obj.number);
        }
    });
    let buttons = document.querySelectorAll('.delete_button');
    buttons.forEach(btn =>{
        btn.onclick = function(e){
            let num = parseInt(e.currentTarget.parentElement.parentElement.querySelector('.carriage__schema').id);
            for(let i = 0; i < carriages.length; i++){
                if(carriages[i].number == num) carriages.splice(i, 1);
            }
            getSeats();
        }
    });
}


function setCuopeCarriage(coupes, number){
    let str = `<div class="carriage_container">
        <div class="schema_title">
        <p class="number">Вагон ${number}</p>
        <div class="delete_button">удалить вагон</div>
        </div>
        <div class="carriage__schema" id="${number}">
            <div class="schema__top">
                <img src="img/WC.png" alt="" class="schema__wc_left">
                <img src="img/security_worker.png" alt="" class="schema__security_worker">
                <div class="schema__coupe_row">
                </div>
                <img src="img/WC.png" alt="" class="schema__wc_right">
            </div>
            <div class="schema__bottom">
                <img src="img/coffee.png" alt="" class="schema__coffe">
                <img src="img/trash.png" alt="" class="schema__trash">
            </div>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', str);

    let div = document.getElementById(number).querySelector('.schema__coupe_row');

    let numberOfSeatsCoupe = coupes * 4;
    for(let i = 1; i <= numberOfSeatsCoupe; i+=4){
        if(i == numberOfSeatsCoupe - 3) fillCoupe(div, i, true);
        else fillCoupe(div, i, false);
    }
}


function fillCoupe(div, number, last){
    let add = '';
    if(last) add = 'last_coupe';
    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">';
    for(let i = number; i < number + 4; i++){
        if(i == number || i == number+1){
            str += `<div class="coupe__seat">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${i}</p>`+
                        '</div>';
        }
        else{
            str += `<div class="coupe__seat">`+
                            `<p class="seat__number_bottom number">${i}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>';
        }
    }

    let type = '';
    if(number == 1) type = 'женское<br>купе';
    else if(last) type = 'мужское<br>купе';
    else type = 'смешанное<br>купе';
 
    str += '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    div.insertAdjacentHTML('beforeend', str);
}

function setPlatzkartCarriage(coupes, number){
    let numberOfSeatsPlatzkart = coupes * 6;
    let str = `<div class="carriage_container">
        <div class="schema_title">
        <p class="number">Вагон ${number}</p>
        <div class="delete_button">удалить вагон</div>
        </div>
        <div class="carriage__schema" id="${number}">
            <div class="schema__top">
                <img src="img/WC.png" alt="" class="schema__wc_left">
                <img src="img/security_worker.png" alt="" class="schema__security_worker">
                <div class="schema__coupe_row">
                    
                </div>
                <img src="img/WC.png" alt="" class="schema__wc_right">
            </div>
            <div class="schema__bottom_platzkart">
                <img src="img/coffee.png" alt="" class="schema__coffe">
                <div class="bottom__coupe_row">
                    
                </div>
                <img src="img/trash.png" alt="" class="schema__trash">
            </div>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', str); 

    let divTop = document.getElementById(number).querySelector('.schema__coupe_row');
    let divBottom = document.getElementById(number).querySelector('.bottom__coupe_row');

    for(let i = 1; i <= numberOfSeatsPlatzkart; i+=6){
        if(i == numberOfSeatsPlatzkart - 5) fillPlatzkart(divTop, divBottom, i, true);
        else fillPlatzkart(divTop, divBottom, i, false);
    }
}

function fillPlatzkart(divTop, divBottom, number, last){
    let add = '';
    let addBottom = '';
    if(last) {
        add = 'last_coupe';
        addBottom = 'last_coupe_bottom';
    }
    let str = '<div class="coupe__wrapper">'+
        `<div class="coupe ${add}">`+
            '<div class="coupe__seats">';
    for(let i = number; i < number+4; i++){
        if(i == number || i == number+1){
            str += `<div class="coupe__seat">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${i}</p>`+
                        '</div>';
        }
        else{
            str += `<div class="coupe__seat">`+
                            `<p class="seat__number_bottom number">${i}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>';
        }
    }

    str += '</div>'+
        '</div>'+
    '</div>';
    divTop.insertAdjacentHTML('beforeend', str);

    let str1 = 
    '<div class="coupe__wrapper">'+
        `<div class="coupe_bottom ${addBottom}">`+
            '<div class="coupe__seats_bottom">';
    for(let i = number+4; i < number+6; i++){
        let pos = '';
        if(i == number+4) pos = 'нижнее';
        else pos = 'верхнее';
        if(i == number+5){
            str1 += `<div class="coupe__seat">`+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top number">${i}</p>`+
                        '</div>';
        }
        else{
            str1 += `<div class="coupe__seat">`+
                            `<p class="seat__number_bottom number">${i}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>';
        }
    }
    str1 += '</div>'+
        '</div>'+
    '</div>';
    divBottom.insertAdjacentHTML('beforeend', str1);
}

function setSvCarriage(coupes, number){
    let str = `<div class="carriage_container">
        <div class="schema_title">
        <p class="number">Вагон ${number}</p>
        <div class="delete_button">удалить вагон</div>
        </div>
        <div class="carriage__schema" id="${number}">
            <div class="schema__top">
                <img src="img/WC.png" alt="" class="schema__wc_left">
                <img src="img/security_worker.png" alt="" class="schema__security_worker">
                <div class="schema__coupe_row">
                    
                </div>
                <img src="img/WC.png" alt="" class="schema__wc_right">
            </div>
            <div class="schema__bottom">
                <img src="img/coffee.png" alt="" class="schema__coffe">
                <img src="img/trash.png" alt="" class="schema__trash">
            </div>
        </div>
    </div>`;

    container.insertAdjacentHTML('beforeend', str);

    let div = document.getElementById(number).querySelector('.schema__coupe_row');

    let numberOfSeatsSV = coupes * 2;
    for(let i = 1; i <= numberOfSeatsSV; i+=2){
        if(i == numberOfSeatsSV - 1) fillSV(div, i, true);
        else fillSV(div, i, false);
    }
}

function fillSV(div, number, last){
    let add = '';
    if(last) add = 'last_coupe';

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">';
    for(let i = number; i < number+2; i++){
        str += `<div class="sv__seat">`+
                            `<p class="seat__number_sv number">${i}</p>`+
                        '</div>';
    }
    let type = '';
    if(number == 1) type = 'женское<br>купе';
    else if(last) type = 'мужское<br>купе';
    else type = 'смешанное<br>купе';
    str +=        '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    div.insertAdjacentHTML('beforeend', str);
}

function setSeatCarriage(row, blockTop, blockBottom, number){
    let str = `<div class="carriage_container">
        <div class="schema_title">
        <p class="number">Вагон ${number}</p>
        <div class="delete_button">удалить вагон</div>
        </div>
        <div class="carriage__schema" id="${number}">
            <div class="seat_carriage__schema__top">
                <img src="img/WC.png" alt="" class="schema__wc_left">
                <img src="img/security_worker.png" alt="" class="schema__security_worker">
                <div class="schema__coupe_row seat_carriage_top_row">
                    
                </div>
                <img src="img/WC.png" alt="" class="schema__wc_right">
            </div>
            <div class="schema__bottom">
                <img src="img/coffee.png" alt="" class="schema__coffe">
                <div class="seat_carriage_bottom_row">
                    
                </div>
                <img src="img/trash.png" alt="" class="schema__trash">
            </div>
        </div>
    </div>`;

    container.insertAdjacentHTML('beforeend', str);

    let divTop = document.getElementById(number).querySelector('.seat_carriage_top_row');
    let divBottom = document.getElementById(number).querySelector('.seat_carriage_bottom_row');

    let numberOfSeatsSeatCarriage = (blockTop + blockBottom) * row;
    for(let i = 1; i <= numberOfSeatsSeatCarriage; i+=(blockTop + blockBottom)){
        fillSeatCarriage(divTop, divBottom, i, blockTop, blockBottom);
    }
}

function fillSeatCarriage(div1, div2, number, block1, block2){
    let str6 = '<div class="seat_block">';
    for(let i = number; i < number+block1; i++){
        str6 += `<div class="coupe__seat">`+
                            `<p class="seat__number number">${i}</p>`+
                        '</div>';
    }
    str6 += '</div>'

    let str7 = '<div class="seat_block bottom_block">';
    for(let i = number+block1; i < number+block1+block2; i++){
        str7 += `<div class="coupe__seat">`+
                            `<p class="seat__number number">${i}</p>`+
                        '</div>';
    }
    str7 += '</div>';

    div1.insertAdjacentHTML('beforeend', str6);
    div2.insertAdjacentHTML('beforeend', str7);
}