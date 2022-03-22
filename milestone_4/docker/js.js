let pagValue = 0;
let totalDivisons = 50;
let maxPerPage = 10;
let corpusData;
const pagination = document.querySelector(`#pagination`);
const prevButton = document.querySelector(`#prev`);
const nextButton = document.querySelector(`#next`);
pagination.innerHTML = `${pagValue + 1} of ${totalDivisons}`;

if ((pagValue + 1) == (totalDivisons)) {
    nextButton.disabled = true;
}

function goBack(){
    pagValue--;
    pagination.innerHTML = `${pagValue + 1} of ${totalDivisons + 1}`;
    if (pagValue == 0){
        prevButton.disabled = true;
    }
    if(pagValue == totalDivisons){
        nextButton.disabled = true;
    }
    else{
        // prevButton.disabled = false;
        nextButton.disabled = false;
    }
    dataPreparer(corpusData, pagValue);
}

function goAhead(){
    pagValue++;
    pagination.innerHTML = `${pagValue + 1} of ${totalDivisons + 1}`;
    if (pagValue > 0){
        prevButton.disabled = false;
    }
    if(pagValue == totalDivisons){
        nextButton.disabled = true;
    }

    dataPreparer(corpusData, pagValue);
}

function getDataFromBE(queryString){	
	fetch(`http://127.0.0.1:8000/${queryString}`, {
			"method": "GET"
		})
    .then((response) => response.json())
    .then((response) => {
        if (response.length > 10) {
            dataPreparer(response);
        }
        else {
            prevButton.disabled = true;
            nextButton.disabled = true;
            if (response.length == 0) {
                pagination.innerHTML = `1 of 1`;
                corpusEntries.innerHTML = `No records found`;
            }
            else {
                dataPreparer(response);
            }
        }
    })
}

function dataPreparer(data, pagValue=0) {
    corpusData = data;
    totalDivisons = Math.ceil(data.length/maxPerPage) - 1;
    pagination.innerHTML = `${pagValue + 1} of ${totalDivisons + 1}`;
    if (pagValue == totalDivisons) {
        showCorpusEntries(corpusData.slice(10*pagValue));
    }
    else {
    showCorpusEntries(corpusData.slice(10*pagValue, 10*pagValue + 10));
    }
}


const corpusEntries = document.querySelector(`#entries`);

const searchText = document.querySelector(`#searchtext`);

const filmCheckBox = document.querySelector(`#film`);
const performerCheckBox = document.querySelector(`#performer`);
const allCheckBox = document.querySelector(`#all`);
const othersCheckBox = document.querySelector(`#others`);
const filmcrewCheckBox = document.querySelector(`#filmcrew`);

const textCheckBox = document.querySelector(`#text`);
const entityCheckBox = document.querySelector(`#entity`);
const textAllCheckBox = document.querySelector(`#textall`);

const getData = function(string) {
    getDataFromBE(string);
}

const createQuery = function() {
    pagValue = 0;
    getData(`textValue=${searchText.value}&central_entity=${entityCheckBox.checked}&text=${textCheckBox.checked}&textALL=${textAllCheckBox.checked}&FILM=${filmCheckBox.checked}&PERFORMER=${performerCheckBox.checked}&typeALL=${allCheckBox.checked}&OTHERS=${othersCheckBox.checked}&FILM-CREW=${filmcrewCheckBox.checked}`);
    nextButton.disabled = false;
    prevButton.disabled = true;
}

const showCorpusEntries = function(data){
    let maxPerPage = 10;
    corpusEntries.innerHTML = ``;
    data.forEach(entry => {
        const entryArticle = document.createElement('article');
        entryArticle.classList.add('entry');

        entryArticle.innerHTML = `
        <div class="record-header">
        <div class="annotation-label">
        <p class="labels">Annotations</p>
        </div>
        <div class="entity">
        <p class="labels">Central Entity</p>
        <p class="label-text">${entry.entity}</p>
        </div>
        <div class="type">
        <p class="labels">Type</p>
        <p class="label-text">${entry.type}</p>
        </div>
        </div>
        <p>${entry.title}</p>
        <p>${entry.text}</p>
        `

        corpusEntries.appendChild(entryArticle);
    });
}

getData(`textValue=${searchText.value}&central_entity=${entityCheckBox.checked}&text=${textCheckBox.checked}&textALL=${true}&FILM=${filmCheckBox.checked}&PERFORMER=${performerCheckBox.checked}&typeALL=${true}&OTHERS=${othersCheckBox.checked}&FILM-CREW=${filmcrewCheckBox.checked}`)
// showCorpusEntries(corpus);