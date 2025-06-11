'use strict'

let monthsShort = ['янв', 'фев', 'март', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

async function setData(){
    let url = 'http://127.0.0.1:8080/client/tickets';
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });

    if(response.ok){
        let body = await response.json();
        let div = document.querySelector('.content-area');
        div.innerHTML = '';

        body.forEach(element => {
            let birthday = element.birthday.slice(8,10) + '.' + element.birthday.slice(5,7) + '.' + element.birthday.slice(0,4);
            let departureTime = element.departureTime.split(' ')[1].substring(0, 5);
            let arrivalTime = element.arrivalTime.split(' ')[1].substring(0, 5);

            let departureDate = new Date(element.departureTime);
            let arrivalDate = new Date(element.arrivalTime);
            let now = new Date();
            let str = `<div class="ticket-area" id="${element.ticketNumber}">`;
            if(departureDate.getTime() > now.getTime()) str +='<button class="cancel-button">Отменить бронь</button>';
            str += `<button class="download-button">скачать pdf</button>
            <div class="ticket">
              <div class="dotted-line"></div>
              <div class="train-info-area">
                <p class="cities">САМАРА - ${element.destination.toUpperCase()}</p>
                <p class="name">Поезд ${element.trainId}</p>
              </div>
              <div class="ticket-info-area">
                <div class="seat-info-area">
                  <p class="wagon">${element.carriageNumber}</p>
                  <p class="seat">${element.position}</p>
                  <p class="wagon-type">${element.type}</p>
                </div>
                <div class="personal-info-area">
                  <p class="FIO">${element.lastname.toUpperCase()} ${element.firstname.toUpperCase()} ${element.patronymic.toUpperCase()}</p>
                  <p class="birth-date">${birthday}</p>
                </div>
                <div class="personal-ticket-info-area">
                  <p class="passport">${element.passport.slice(0,4)} ${element.passport.slice(4,10)}</p>
                  <p class="ticket-number">${element.ticketNumber}</p>
                </div>
              </div>
              <div class="route-area">
                <div class="departure-time-area">
                  <p class="date">${departureDate.getDate()} ${monthsShort[departureDate.getMonth()]}</p>
                  <p class="time">${departureTime}</p>
                </div>
                <div class="arrival-time-area">
                  <p class="date">${arrivalDate.getDate()} ${monthsShort[arrivalDate.getMonth()]}</p>
                  <div class="arrival-time-group">
                    <p class="time">${arrivalTime}</p>
                    <p class="label">(Самара)</p>
                  </div>
                </div>
              </div>
              <div class="departure-timedate-area">
                <div class="date">
                  <p class="day">${departureDate.getDate()}</p>
                  <p class="month">${months[departureDate.getMonth()]}</p>
                </div>
                <p class="time">${departureTime}</p>
              </div>
            </div>
          </div>`;
          div.insertAdjacentHTML('beforeend', str);
        });
      setButtons();
    }

}

const { jsPDF } = window.jspdf;

setData();

function setButtons(){
  let buttons = document.querySelectorAll('.cancel-button');
  buttons.forEach(button=>{
    button.onclick = async function(e){
      let ticketNumber = e.currentTarget.parentElement.id;
      let url = `http://127.0.0.1:8080/client/delete-ticket/${ticketNumber}`;
      let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
      });
      if(response.ok) setData();
      else alert('Произошла ошибка при отмене');
    }
  });

    let downloadButtons = document.querySelectorAll('.download-button');
  downloadButtons.forEach(button => {
    button.onclick = function(e) {
      const ticketEl = e.currentTarget.parentElement;
      const ticketNumber = ticketEl.id;
      const cities = ticketEl.querySelector('.cities').innerText;
      const [cityFrom, cityTo] = cities.split(' - ');
      const train = ticketEl.querySelector('.name').innerText;
      const trainClean = train.replace(/^Поезд\s+/i, '');
      const fio = ticketEl.querySelector('.FIO').innerText;
      const birth = ticketEl.querySelector('.birth-date').innerText;
      const passport = ticketEl.querySelector('.passport').innerText;
      const wagon = ticketEl.querySelector('.wagon').innerText;
      const seat = ticketEl.querySelector('.seat').innerText;
      const wagonType = ticketEl.querySelector('.wagon-type').innerText;
      const departureDate = ticketEl.querySelector('.departure-time-area .date').innerText;
      const departureTime = ticketEl.querySelector('.departure-time-area .time').innerText;
      const arrivalDate = ticketEl.querySelector('.arrival-time-area .date').innerText;
      const arrivalTime = ticketEl.querySelector('.arrival-time-area .time').innerText;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFont('Roboto', 'normal');

      const pageWidth = doc.internal.pageSize.getWidth();
      const marginLeft = 20;
      let y = 10;

      doc.setFillColor(0, 102, 204);
      doc.rect(0, y, pageWidth, 25, 'F');

      doc.setFontSize(60);
      doc.setTextColor(255, 255, 255);
      doc.text('ЭЛЕКТРОННЫЙ БИЛЕТ', pageWidth / 2, y + 20, { align: 'center' });

      const centerX = pageWidth / 2;
      const boxX = 20;
      const boxY = 120;
      const boxWidth = 45;
      const boxHeight = 75;
      const radius = 3;

      doc.setDrawColor(0, 102, 204);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, radius, radius, 'FD');

      const paddingX = 5;
      const paddingY = 10;

      const leftColX = boxX + paddingX;
      let blockTopY = boxY + paddingY;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Поезд', leftColX, blockTopY);
      doc.setFontSize(40);
      doc.text(trainClean, leftColX, blockTopY + 11.5);

      doc.setFontSize(14);
      doc.text('Вагон', leftColX, blockTopY + 20);
      doc.setFontSize(40);
      doc.text(wagon, leftColX, blockTopY + 31.5);
      doc.setFontSize(14);
      doc.text(wagonType, leftColX, blockTopY + 36);

      doc.setFontSize(14);
      doc.text('Место', leftColX, blockTopY + 47.5);
      doc.setFontSize(40);
      doc.text(seat, leftColX, blockTopY + 59);

      const routeY = 49;
      const routeHeight = 50;

      const lineX = 60;
      const lineY1 = routeY + 2;
      const lineY2 = routeY + routeHeight - 2;

      doc.setDrawColor(0, 102, 204);
      doc.setFillColor(0, 102, 204);
      doc.setLineWidth(0.5);

      doc.line(lineX, lineY1, lineX, lineY2);

      const circleRadius = 1.2;
      doc.circle(lineX, lineY1, circleRadius, 'F');
      doc.circle(lineX, lineY2, circleRadius, 'F');

      doc.setTextColor(0, 0, 0);

      doc.setFontSize(20);
      doc.text(departureDate, lineX - 5, lineY1 + 5, { align: 'right' });
      doc.setFontSize(35);
      doc.text(departureTime, lineX - 5, lineY1 + 15, { align: 'right' });
      doc.setFontSize(60);
      doc.text(cityFrom, lineX + 4, lineY1 + 15);

      doc.setFontSize(20);
      doc.text(arrivalDate, lineX - 5, lineY2 - 10, { align: 'right' });
      doc.setFontSize(35);
      doc.text(arrivalTime, lineX - 5, lineY2, { align: 'right' });
      doc.setFontSize(60);
      doc.text(cityTo, lineX + 4, lineY2 );

      const lineCenterY = (lineY1 + lineY2) / 2;
      const horizLineThickness = 0.3;
      doc.setDrawColor(150);
      doc.setLineWidth(horizLineThickness);

      doc.line(
        lineX - 40,
        lineCenterY,
        lineX - 4,
        lineCenterY
      );

      const width1 = doc.getTextWidth(cityFrom);
      const width2 = doc.getTextWidth(cityTo);
      const maxWidth = Math.max(width1, width2);

      doc.line(
        lineX + 4,
        lineCenterY,
        lineX + maxWidth + 10,
        lineCenterY
      );

      const nameX = 75;
      const nameY = boxY + 20;


      let fontSize = 40;
      doc.setFontSize(fontSize);
      let fioWidth = doc.getTextWidth(fio);

      const maxFioWidth = 200;
      const minFontSize = 18;

      while (fioWidth > maxFioWidth && fontSize > minFontSize) {
        fontSize -= 2;
        doc.setFontSize(fontSize);
        fioWidth = doc.getTextWidth(fio);
      }

      let lines;
      if (fioWidth > maxFioWidth) {
        doc.setFontSize(minFontSize);
        lines = doc.splitTextToSize(fio, maxFioWidth);
      } else {
        lines = [fio];
      }

      const fixedLineHeight = 6; // Заменить на нужное: 10–13
      lines.forEach((line, i) => {
        doc.text(line, nameX, nameY + i * fixedLineHeight);
      });


      doc.setFontSize(16);
      doc.text(`ПАСПОРТ РФ ${passport}`, nameX + 1, nameY - 15);

      const fioRightX = nameX + fioWidth;
      const pageRightMargin = 200;
      doc.text(birth, fioRightX - 1, nameY - 15, { align: 'right' });

      const ticketY = 170;
      const ticketX = 75;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(ticketNumber, ticketX, ticketY);

      const canvas = document.createElement('canvas');

      JsBarcode(canvas, ticketNumber, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: false,
      });

      const barcodeImg = canvas.toDataURL('image/png');
      const barcodeWidth = 200;
      const barcodeHeight = 35;

      const barcodeX = 75;
      const barcodeY = 155;

      doc.addImage(barcodeImg, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);

      const chars = ticketNumber.split('');
      const barcodeTextWidth = barcodeWidth;
      const textFontSize = 16;

      doc.setFontSize(textFontSize);

      const totalTextWidth = chars.reduce((sum, char) => {
        return sum + doc.getTextWidth(char);
      }, 0);

      const extraSpacing = (barcodeTextWidth - totalTextWidth - 26) / (chars.length - 1);

      let currentX = barcodeX + 13;
      const textY = barcodeY + barcodeHeight + 2;

      for (const char of chars) {
        doc.text(char, currentX, textY);
        currentX += doc.getTextWidth(char) + extraSpacing;
      }

      doc.save(`ticket_${ticketNumber}.pdf`);
    }
  });
}