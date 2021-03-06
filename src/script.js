let dataFromJson;
let rootElement = document.getElementById('root');
let onlineData = document.getElementById('onlineData');
let actualLastCardId = 0;

const config = {
  apiKey: "AIzaSyA4hypu-Bbzm07siiM0J68Cb5qFr_jsOUk",
  authDomain: "tp-vanilla.firebaseapp.com",
  projectId: "tp-vanilla",
  storageBucket: "tp-vanilla.appspot.com",
  messagingSenderId: "97585784853",
  appId: "1:97585784853:web:7c3aa6c74455b6c05d861c",
  measurementId: "G-TPP20ZRJT9"
};
firebase.initializeApp(config);
const db = firebase.firestore();

const getCards = async () => {
  db.collection('card').get()
    .then(querySnapshot => {
      const documents = querySnapshot.docs.map(doc => doc.data())
      documents.forEach((element) => {
        console.log(documents);
        if (!document.getElementById(element.id)) {
          createCard(document.getElementsByClassName('cardList'), element.title, element.text, element.id)
          actualLastCardId++;
        }
      });
    })
}

const createCardOnline = async () => {
  getCards();
  let title = document.getElementById('newCardTitle').value;
  let text = document.getElementById('newCardText').value;
  db.collection('card').add({
    id: actualLastCardId,
    title: title,
    text: text
  })
  createCard(document.getElementsByClassName('cardList'), title, text, actualLastCardId)
  document.getElementsByClassName('inputCard')[0].remove();
  actualLastCardId++;
}

const deleteCard = (id) => {
  document.getElementById(id).remove();
}

const closeOnlineCardEditor = () => {
  document.getElementsByClassName('inputCard')[0].remove();
}

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
  createAnElement('button', 'addCard'),
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
document.getElementsByClassName('addCard')[0].innerText = '+';

readTextFile("./src/courseData.json", (text) => {
  dataFromJson = JSON.parse(text);
  dataFromJson.forEach((element, i) => {
    createCard(document.getElementsByClassName('cardList'), element.name, element.description, i)
    actualLastCardId++;
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

addCardButton = document.getElementsByClassName('addCard')[0];
addCardButton.addEventListener("click", () => {
  createInputCard();
});

const createCard = (parent, title, text, id) => {
  let card = document.createElement('div');
  card.classList.add('cardContent');
  card.id = id;
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

  let delButton = document.createElement('button');
  delButton.innerText = 'Delete';
  delButton.setAttribute("onclick", `deleteCard(${id})`);
  card.appendChild(delButton);
};

const createInputCard = () => {
  let card = document.createElement('div');
  card.classList.add('inputCard');
  document.getElementsByClassName('cardList')[0].appendChild(card);

  let acardTitle = document.createElement('a');
  acardTitle.innerText = 'Write your title';
  card.appendChild(acardTitle);

  let cardTitle = document.createElement('input');
  cardTitle.id = 'newCardTitle';
  card.appendChild(cardTitle);

  let acardText = document.createElement('a');
  acardText.innerText = 'Write your text';
  card.appendChild(acardText);

  let cardText = document.createElement('input');
  cardText.id = 'newCardText';
  card.appendChild(cardText);

  let button = document.createElement('button');
  button.innerText = 'Submit';
  button.setAttribute("onclick", `createCardOnline()`);
  card.appendChild(button);

  let closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.setAttribute("onclick", `closeOnlineCardEditor()`);
  card.appendChild(closeButton);
};
