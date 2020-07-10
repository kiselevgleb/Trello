// import data from './repo.js';
import Note from './Note.js';

const table = document.querySelectorAll('table');

let data = [];

export default function init() {
  let d = JSON.parse(localStorage.getItem("dataLS"));
  d.forEach(element => {
    data.push(new Note(element.name, element.status));
  });
}
init();

function updateLS() {
  let serialObj = JSON.stringify(data);
  localStorage.setItem("dataLS", serialObj);
}
// let d = JSON.parse(localStorage.getItem("dataLS"));
// d.forEach(element => {
//   data.push(new Note(element.name, element.status));
// });


// let coin;
// let coinPlus = true;

// function edit(but, index) {
//   but.addEventListener('click', (e) => {
//     const node = inputName.parentElement.childNodes;
//     node[5].innerText = ' ';
//     node[11].innerText = ' ';
//     if (divEdit.style.display !== 'block') {
//       divEdit.style.display = 'block';
//     } else if (divEdit.style.display === 'block' && coin === Number(e.target.getAttribute('num'))) {
//       divEdit.style.display = 'none';
//     }
//     inputName.value = data[index].name;
//     inputPrise.value = data[index].prise;
//     coin = index;
//     coinPlus = true;
//   });
// }

function add() {

  for (let index = 0; index < table.length; index++) {
    const element = table[index];
    element.innerText = "";
    if (index === 0) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = "TODO";
      thTitle.classList.add('title');
      trTitle.appendChild(thTitle);
      element.appendChild(trTitle);
    } else if (index === 1) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = "IN PROGRESS";
      trTitle.appendChild(thTitle);
      element.appendChild(trTitle);
    } else if (index === 2) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = "DONE";
      trTitle.appendChild(thTitle);
      element.appendChild(trTitle);
    }
  }
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const tr = document.createElement('tr');
    const thName = document.createElement('td');
    const butDel = document.createElement('a');
    butDel.innerHTML = '&#9747';
    thName.classList.add('dataText');
    butDel.classList.add('del');
    butDel.setAttribute('num', index);
    thName.innerHTML = element.name;
    thName.appendChild(butDel);
    tr.appendChild(thName);

    if (element.status === "TODO") {
      table[0].appendChild(tr);
    } else if (element.status === "IN PROGRESS") {
      table[1].appendChild(tr);
    } else if (element.status === "DONE") {
      table[2].appendChild(tr);
    }
  };

  for (let index = 0; index < table.length; index++) {
    const element = table[index];
    const trPlus = document.createElement('tr');
    const thPlus = document.createElement('th');
    const butPlus = document.createElement('a');
    butPlus.classList.add('plus');
    butPlus.innerHTML = '&#10011' + " Add another card";
    butPlus.setAttribute('id', "plus");
    butPlus.setAttribute('num', index);

    thPlus.appendChild(butPlus);
    trPlus.appendChild(thPlus);
    if (index === 0) {
      butPlus.setAttribute('num', "TODO");
    } else if (index === 1) {
      butPlus.setAttribute('num', "IN PROGRESS");
    } else if (index === 2) {
      butPlus.setAttribute('num', "DONE");
    }

    element.appendChild(trPlus);
  };
  plus();
  del();
  move();
}

function del() {
  const butDel = document.querySelectorAll('.del');
  butDel.forEach(element => {
    element.addEventListener('click', (e) => {
      console.log(e.target.getAttribute('num'));
      data.splice(e.target.getAttribute('num'), 1);
      add();
      updateLS();
    });
  });
}

function plus() {
  const butPlus = document.querySelectorAll('.plus');
  // console.log(butPlus);
  // console.log(Array.from(butPlus));
  butPlus.forEach(element => {
    element.addEventListener('click', (e) => {
      e.target.parentElement.style.display = "none";
      const tab = e.target.parentElement.parentElement;
      const trNew = document.createElement('tr');
      const thNew = document.createElement('th');
      const inputNew = document.createElement('input');
      // inputNew.type = "text";
      inputNew.placeholder = "Enter a title for this card...";
      thNew.appendChild(inputNew);
      trNew.appendChild(thNew);
      // tab.appendChild(trNew);
      tab.before(trNew);
      const trCross = document.createElement('tr');
      const thCross = document.createElement('th');
      const butCross = document.createElement('a');
      const butAdd = document.createElement('button');
      butAdd.innerHTML = 'Add Card';
      butAdd.classList.add('add');
      butCross.classList.add('plus');
      butCross.innerHTML = '&#9747';
      butCross.setAttribute('id', "cross");
      thCross.appendChild(butAdd);
      thCross.appendChild(butCross);
      trCross.appendChild(thCross);
      tab.before(trCross);
      butCross.addEventListener('click', () => {
        trCross.remove();
        trNew.remove();
        e.target.parentElement.style.display = "inline-block";
        add();
      
      });
      butAdd.addEventListener('click', () => {
        trCross.remove();
        trNew.remove();
        e.target.parentElement.style.display = "inline-block";
        console.log(inputNew.value);
        console.log(e.target.getAttribute('num'));
        data.push(new Note(inputNew.value, e.target.getAttribute('num')));
        add();
      updateLS();
        
      });
      
    });
  });
}

function move() {
  const divMove = document.querySelector('div');
  let draggedEl = null;
  let ghostEl = null;

  divMove.addEventListener('mousedown', (evt) => {
    // evt.preventDefault();
    if (!evt.target.classList.contains('dataText')) {
      return;
    }
    draggedEl = evt.target;
    ghostEl = evt.target.cloneNode(true);
    ghostEl.classList.add('dragged');
    document.body.appendChild(ghostEl);
    ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth / 2}px`;
    ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight / 2}px`;
  });
  divMove.addEventListener('mousemove', (evt) => {
    evt.preventDefault();
    if (!draggedEl) {
      return;
    }
    ghostEl.style.left = `${evt.pageX - ghostEl.offsetWidth / 2}px`;
    ghostEl.style.top = `${evt.pageY - ghostEl.offsetHeight / 2}px`;
  });
  divMove.addEventListener('mouseleave', (evt) => {
    if (!draggedEl) {
      return;
    }
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl = null;
  });

  divMove.addEventListener('mouseup', (evt) => {
    if (!draggedEl) {
      return;
    }
    const closest = document.elementFromPoint(evt.clientX, evt.clientY);

    const tr = document.createElement('tr');
    tr.appendChild(draggedEl);
    if (closest.classList.contains('dataText') || closest.classList.contains('plus')) {
      closest.parentElement.before(tr);
    } else if (closest.classList.contains('title')) {
      closest.parentElement.after(tr);
    } else {
      return;
    }
    console.log(draggedEl.firstChild.textContent);
    console.log(closest.parentElement.parentElement.firstChild.innerText);

    data.splice(draggedEl.children[0].getAttribute('num'), 1);

    data.push(new Note(draggedEl.firstChild.textContent, closest.parentElement.parentElement.firstChild.innerText));
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl = null;
    updateLS();
  });
}






// function move() {
//   const trMove = document.querySelectorAll('td');
//   trMove.forEach(element => {
//     let ball = element;
//     ball.addEventListener('mousedown', (event) => { 

//   // ball.onmousedown = function(event) { // (1) отследить нажатие

//     // (2) подготовить к перемещению:
//     // разместить поверх остального содержимого и в абсолютных координатах
//     ball.style.position = 'absolute';
//     ball.style.zIndex = 1000;
//     // переместим в body, чтобы мяч был точно не внутри position:relative
//     document.body.append(ball);
//     // и установим абсолютно спозиционированный мяч под курсор

//     moveAt(event.pageX, event.pageY);

//     // передвинуть мяч под координаты курсора
//     // и сдвинуть на половину ширины/высоты для центрирования
//     itemsEl.addEventListener('mousemove', () => { 
//     // function moveAt(pageX, pageY) {
//       ball.style.left = event.pageX - ball.offsetWidth / 2 + 'px';
//       ball.style.top = event.pageY - ball.offsetHeight / 2 + 'px';
//     });

//     // function onMouseMove(event) {
//     //   moveAt(event.pageX, event.pageY);
//     // }

//     // (3) перемещать по экрану
//     // document.addEventListener('mousemove', onMouseMove);

//     // (4) положить мяч, удалить более ненужные обработчики событий
//     // ball.onmouseup = function() {
//     //   ball.addEventListener('mouseup', (evt) => {
//     //   document.removeEventListener('mousemove', onMouseMove);
//     //   ball.onmouseup = null;
//     // });

//   });
// });
// }



// function close() {
//   butClose.addEventListener('click', () => {
//     divEdit.style.display = 'none';
//   });
// }

// function save() {
//   butSave.addEventListener('click', (e) => {
//     const node = e.target.parentElement.childNodes;
//     node[5].innerText = ' ';
//     node[11].innerText = ' ';
//     if (!coinPlus) {
//       if (node[3].value.length === 0) {
//         node[5].innerText = 'Name field is empty';
//         node[11].innerText = ' ';
//       } else if (node[9].value.length === 0 || Number(node[9].value) <= 0 || Number.isNaN(Number(node[9].value))) {
//         node[11].innerText = 'Prise field error';
//         node[5].innerText = ' ';
//       } else {
//         const dataNew = new Note(node[3].value, Number(node[9].value));
//         data.push(dataNew);
//         divEdit.style.display = 'none';
//         add(data);
//       }
//     } else if (node[3].value.length === 0) {
//       node[5].innerText = 'Name field is empty';
//       node[11].innerText = ' ';
//     } else if (node[9].value.length === 0 || Number(node[9].value) <= 0 || Number.isNaN(Number(node[9].value))) {
//       node[11].innerText = 'Prise field error';
//       node[5].innerText = ' ';
//     } else {
//       data[coin].name = node[3].value;
//       data[coin].prise = Number(node[9].value);
//       divEdit.style.display = 'none';
//       add(data);
//     }
//   });
// }

add();
// del();
// close();
// save();