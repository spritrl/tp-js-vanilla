let dataFromJson;
let rootElement = document.getElementById('root');

const readTextFile = (file, callback) => {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

const createAnElement = (element, classname, child) => {
  let newElement = document.createElement(element);
  if (classname) {
    newElement.classList.add(classname);
  }
  if (child === undefined) {
    return newElement;
  } else {
    rootElement.appendChild(newElement);
    if (child) {
      child.forEach((childElement) => {
        newElement.appendChild(childElement);
      });
    }
  }
}

createAnElement('div',
  'header',
  [createAnElement('img')]);

createAnElement('div',
  'content',
  [createAnElement('h1'),
  createAnElement('div', 'cardList')
  ]);

createAnElement('div',
  'hidden',
  [createAnElement('h1', 'h1Hidden'),
  createAnElement('a', 'aHidden'),
  createAnElement('button', 'buttonHidden'),
  ]);

document.getElementsByTagName('img')[0].src = 'src/logo_ynov.png';
document.getElementsByTagName('h1')[0].innerText = 'Ynov web courses';

readTextFile("./src/courseData.json", (text) => {
  dataFromJson = JSON.parse(text);
  dataFromJson.forEach((element) => {
    createCard(document.getElementsByClassName('cardList'), element.name, element.description)
  });
});

const changeHiddenBoxVisibility = (display) => {
  let visibility = document.getElementsByClassName('hidden');
  visibility[0].style.display = display ? 'block' : 'none'
}
const openHiddenMenu = (title, text) => {
  changeHiddenBoxVisibility(true);
  let h1H = document.getElementsByClassName('h1Hidden');
  let aH = document.getElementsByClassName('aHidden');
  let buttonH = document.getElementsByClassName('buttonHidden');
  h1H[0].innerText = title;
  aH[0].innerText = text;
  buttonH[0].setAttribute("onclick", `changeHiddenBoxVisibility(false)`);
  buttonH[0].innerText = 'close';
}

const createCard = (parent, title, text) => {
  let card = document.createElement('div');
  card.classList.add('cardContent');
  parent[0].appendChild(card);

  let cardTitle = document.createElement('h2');
  cardTitle.innerText = title;
  card.appendChild(cardTitle);

  let cardContent = document.createElement('a');
  cardContent.innerText = text;
  card.appendChild(cardContent);

  let button = document.createElement('button');
  button.innerText = 'Get details';
  button.setAttribute("onclick", `openHiddenMenu("${title}", "${text}")`);
  card.appendChild(button);
};
