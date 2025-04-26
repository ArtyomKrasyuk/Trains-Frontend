'use strict'

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
}



// response body
let numberOfSeatsPlatzkart = 60;
let str2 = `<p class="carriage__number">12 вагон</p>`+
    `<p class="carriage__seats">${numberOfSeatsPlatzkart} мест</p>`+
    `<p class="carriage__price">2134₽</p>`;
let div2 = document.getElementById('platzkart_info');
div2.insertAdjacentHTML('beforeend', str2);
if(numberOfSeatsCoupe % 6 == 0){
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

function fillCoupe(number, type, last){
    let add = '';
    if(last) add = 'last_coupe';

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">'+
                        '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top">${number+1}</p>`+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                                '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                                `<p class="seat__number_top">${number+3}</p>`+
                        ' </div>'+
                        '<div class="coupe__seat" data-tooltip="4234₽, нижнее">'+
                            `<p class="seat__number_bottom">${number}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="4234₽, нижнее">'+
                            `<p class="seat__number_bottom">${number+2}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('coupe_seats');
    div.insertAdjacentHTML('beforeend', str);
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
                            `<p class="seat__number_top">${number+1}</p>`+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                                '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                                `<p class="seat__number_top">${number+3}</p>`+
                        ' </div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, нижнее">'+
                            `<p class="seat__number_bottom">${number}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                        '<div class="coupe__seat" data-tooltip="2134₽, нижнее">'+
                            `<p class="seat__number_bottom">${number+2}</p>`+
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
                    `<p class="seat__number_bottom">${number+4}</p>`+
                    '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
            '</div>'+
                '<div class="coupe__seat" data-tooltip="2134₽, верхнее">'+
                    '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                    `<p class="seat__number_top">${number+5}</p>`+
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
                            `<p class="seat__number_sv">${number}</p>`+
                        '</div>'+
                        '<div class="sv__seat" data-tooltip="4234₽">'+
                                `<p class="seat__number_sv">${number+1}</p>`+
                        ' </div>'+
                    '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.getElementById('sv_seats');
    div.insertAdjacentHTML('beforeend', str);
}

function fillSeatCarriage(number, block1, block2){
    str1 = '<div class="seat_block">';
    for(let i = 0; i < block1; i++){
        str1 += '<div class="coupe__seat" data-tooltip="2134₽">'+
                    `<p class="seat__number">${number+i}</p>`+
               ' </div>';
    }
    str1 += '</div>'

    str2 = '<div class="seat_block bottom_block">';
    for(let i = 0; i < block2; i++){
        str2 += '<div class="coupe__seat" data-tooltip="2134₽">'+
                    `<p class="seat__number">${number+block1+i}</p>`+
               ' </div>';
    }
    str2 += '</div>';

    let div1 = document.getElementById('seat_carriage_seats');
    div1.insertAdjacentHTML('beforeend', str1);
    let div2 = document.getElementById('seat_carriage_bottom_seats');
    div2.insertAdjacentHTML('beforeend', str2);
}