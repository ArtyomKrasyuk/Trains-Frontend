'use strict'

// response body
let numberOfSeatsCoupe = 36;
let type = 'Смешанное купе';
let array = type.split(' ');
let newType = array[0] + '<br>' + array[1];
if(numberOfSeatsCoupe % 4 == 0){
    for(let i = 1; i < numberOfSeatsCoupe; i+=4){
        if(i == numberOfSeatsCoupe - 3) fillSchema(i, newType, true);
        else fillSchema(i, newType, false);
    }
}

function fillSchema(number, type, last){
    let add = '';
    if(last) add = 'last_coupe';

    let str = '<div class="coupe__wrapper">'+
                `<div class="coupe ${add}">`+
                    '<div class="coupe__seats">'+
                        '<div class="coupe__seat">'+
                            '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                            `<p class="seat__number_top">${number+1}</p>`+
                        '</div>'+
                        '<div class="coupe__seat">'+
                                '<img src="img/strela_up.png" alt="" class="seat__img_top">'+
                                `<p class="seat__number_top">${number+3}</p>`+
                        ' </div>'+
                        '<div class="coupe__seat">'+
                            `<p class="seat__number_bottom">${number}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                        '<div class="coupe__seat">'+
                            `<p class="seat__number_bottom">${number+2}</p>`+
                            '<img src="img/strela_down.png" alt="" class="seat__img_bottom">'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                `<p class="coupe__type">${type}</p>`+
            '</div>';
    let div = document.querySelector('.schema__coupe_row');
    div.insertAdjacentHTML('beforeend', str);
}