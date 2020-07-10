import Note from './Note.js';

const table = document.querySelectorAll('table');

const data = [];

export default function init() {
  const d = JSON.parse(localStorage.getItem('dataLS'));
  d.forEach((element) => {
    data.push(new Note(element.name, element.status));
  });
}
init();

function updateLS() {
  const serialObj = JSON.stringify(data);
  localStorage.setItem('dataLS', serialObj);
}


function add() {
  for (let index = 0; index < table.length; index++) {
    const element = table[index];
    element.innerText = '';
    if (index === 0) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = 'TODO';
      thTitle.classList.add('title');
      trTitle.appendChild(thTitle);
      element.appendChild(trTitle);
    } else if (index === 1) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = 'IN PROGRESS';
      trTitle.appendChild(thTitle);
      element.appendChild(trTitle);
    } else if (index === 2) {
      const trTitle = document.createElement('tr');
      const thTitle = document.createElement('th');
      thTitle.innerText = 'DONE';
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

    if (element.status === 'TODO') {
      table[0].appendChild(tr);
    } else if (element.status === 'IN PROGRESS') {
      table[1].appendChild(tr);
    } else if (element.status === 'DONE') {
      table[2].appendChild(tr);
    }
  }

  for (let index = 0; index < table.length; index++) {
    const element = table[index];
    const trPlus = document.createElement('tr');
    const thPlus = document.createElement('th');
    const butPlus = document.createElement('a');
    butPlus.classList.add('plus');
    butPlus.innerHTML = '&#10011' + ' Add another card';
    butPlus.setAttribute('id', 'plus');
    butPlus.setAttribute('num', index);

    thPlus.appendChild(butPlus);
    trPlus.appendChild(thPlus);
    if (index === 0) {
      butPlus.setAttribute('num', 'TODO');
    } else if (index === 1) {
      butPlus.setAttribute('num', 'IN PROGRESS');
    } else if (index === 2) {
      butPlus.setAttribute('num', 'DONE');
    }

    element.appendChild(trPlus);
  }
  plus();
  del();
  move();
}

function del() {
  const butDel = document.querySelectorAll('.del');
  butDel.forEach((element) => {
    element.addEventListener('click', (e) => {
      data.splice(e.target.getAttribute('num'), 1);
      add();
      updateLS();
    });
  });
}

function plus() {
  const butPlus = document.querySelectorAll('.plus');
  butPlus.forEach((element) => {
    element.addEventListener('click', (e) => {
      e.target.parentElement.style.display = 'none';
      const tab = e.target.parentElement.parentElement;
      const trNew = document.createElement('tr');
      const thNew = document.createElement('th');
      const inputNew = document.createElement('input');
      // inputNew.type = "text";
      inputNew.placeholder = 'Enter a title for this card...';
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
      butCross.setAttribute('id', 'cross');
      thCross.appendChild(butAdd);
      thCross.appendChild(butCross);
      trCross.appendChild(thCross);
      tab.before(trCross);
      butCross.addEventListener('click', () => {
        trCross.remove();
        trNew.remove();
        e.target.parentElement.style.display = 'inline-block';
        add();
      });
      butAdd.addEventListener('click', () => {
        trCross.remove();
        trNew.remove();
        e.target.parentElement.style.display = 'inline-block';
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

    data.splice(draggedEl.children[0].getAttribute('num'), 1);

    data.push(new Note(draggedEl.firstChild.textContent, closest.parentElement.parentElement.firstChild.innerText));
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl = null;
    updateLS();
  });
}

add();