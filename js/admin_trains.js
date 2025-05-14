'use strict'

let container = document.querySelector('.trains');

document.getElementById('append_train').onclick = function(e){
    window.location.href = 'create_train.html?trainNumber=new';
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
        body.forEach(element => {
            let trainNumber = element.trainNumber;
            let str = `<div class="train">
                <p class="train__number">${trainNumber}</p>
            </div>`;
            container.insertAdjacentHTML('beforeend', str); 
        });
        let trains = document.querySelectorAll('.train');
        trains.forEach(train => {
            train.onclick = function(e){
                let number = e.currentTarget.querySelector('.train__number').innerHTML;
                window.location.href = `create_train.html?trainNumber=${number}`;
            }
        });
    }
    else alert('Не удалось загрузить поезда')
}

getTrains();