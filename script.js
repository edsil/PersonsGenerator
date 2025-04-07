const namesFile = 'names.json';
const surnamesFile = 'surnames.json';

var listOfNames, listOfSurnames;
var filteredNamesMale, filteredNamesFemale, filteredSurnames;
var countNames, countSurnames;

var numberOfPersonsValue, countryOriginValue, eyeColorValue, hairColorValue;
var dobFromValue, dobToValue;
var maleGenderValue, femaleGenderValue, otherGenderValue;
var maleGenderLabel, femaleGenderLabel, otherGenderLabel;
var clearanceValue, pobValue, phoneNumberTypeValue;
var selectorEmail, emailDomainValue, healthValue;

var paramNumberOfPersons, paramListOfCountries, paramListEyeColors, paramListHairColors;
var paramDobFrom, paramDobTo;
var paramMaleGender, paramFemaleGender, paramOtherGender;
var paramClearanceList, paramPob, paramPhoneType, paramEmailType, paramEmailDomain, paramHealth;

window.onload = function() {
    countNamesPerCountry();
    countSurnamesPerCountry();
    openTab(null, 'parameters');
    numberOfPersonsValue = document.getElementById('number-of-persons');
    countryOriginValue = document.getElementById("country-origin");
    eyeColorValue = document.getElementById("eye-colors");
    hairColorValue = document.getElementById("hair-colors");
    dobFromValue = document.getElementById("dob-from");
    dobToValue = document.getElementById("dob-to");
    maleGenderValue = document.getElementById("male");
    femaleGenderValue = document.getElementById("female");
    otherGenderValue = document.getElementById("othergender");
    maleGenderLabel = document.getElementById("male-valuelabel");
    femaleGenderLabel = document.getElementById("female-valuelabel");
    otherGenderLabel = document.getElementById("othergender-valuelabel");
    setGenderValues();
    maleGenderValue.addEventListener('input', ()=>setGenderValues());
    femaleGenderValue.addEventListener('input', ()=>setGenderValues());
    otherGenderValue.addEventListener('input', ()=>setGenderValues());
    clearanceValue = document.getElementById("clearancelevel");
    pobValue = document.getElementById("pob");
    phoneNumberTypeValue = document.getElementById("phonenumber");
    selectorEmail = document.getElementById("email");
    selectorEmail.addEventListener('input', ()=>handleSelectorEmailChange());
    emailDomainValue = document.getElementById("emaildomain");
    healthValue = document.getElementById("health");
    
}

function generatePersons() {
    loadParameters();
    const persons = generateRandomPersons();
    postEntriesInTable(persons, 'name-list');
    openTab(null, 'name-list')
}

function loadParameters() {
    var setCountryNames = new Set();
    var setCountrySurnames = new Set();
    countNames.forEach(entry => {setCountryNames.add(entry.country)});
    countSurnames.forEach(entry => {setCountrySurnames.add(entry.country)});

    paramListOfCountries = countryOriginValue.value.toLowerCase().trim().replace(/[,\s]+/g, ',').split(',').filter(e=> e.length==2);
    if(paramListOfCountries.length > 0){
        paramListOfCountries = paramListOfCountries.filter(country => {return setCountryNames.has(country) && setCountrySurnames.has(country)});
    } else {
        paramListOfCountries = Array.from(setCountryNames).filter(country => {return setCountrySurnames.has(country)});
    }
    filteredNamesMale = listOfNames.filter(name => paramListOfCountries.includes(name.country) && (name.gender=="male" || name.gender=="unisex"));
    filteredNamesFemale = listOfNames.filter(name => paramListOfCountries.includes(name.country) && (name.gender=="female" || name.gender=="unisex"));
    filteredSurnames = listOfSurnames.filter(surname => paramListOfCountries.includes(surname.country));
    paramNumberOfPersons = Math.max(1,parseInt(numberOfPersonsValue.value));
    paramListEyeColors = eyeColorValue.value.toLowerCase().trim().replace(/[,\s]+/g, ',').split(',').filter(e=> e.length>1);
    paramListHairColors = hairColorValue.value.toLowerCase().trim().replace(/[,\s]+/g, ',').split(',').filter(e=> e.length>1);
    paramDobFrom = Date.parse(dobFromValue.value);
    paramDobTo = Date.parse(dobToValue.value)
    paramMaleGender = parseFloat(maleGenderValue.value);
    paramFemaleGender = parseFloat(femaleGenderValue.value);
    paramOtherGender = parseFloat(otherGenderValue.value);
    paramClearanceList = clearanceValue.value.toLowerCase().trim().replace(/[,\s]+/g, ',').split(',').filter(e=> e.length>0);
    paramPob = pobValue.value;
    paramPhoneType = phoneNumberTypeValue.value;
    paramEmailType = selectorEmail.value;
    if(paramEmailType != 'blank'){
        paramEmailDomain = emailDomainValue.value.toLowerCase().trim();
    } else paramEmailDomain = null;
    paramHealth = healthValue.value;
    console.log(paramListOfCountries, paramNumberOfPersons, paramListEyeColors, paramListHairColors, paramDobFrom, paramDobTo, paramMaleGender, paramFemaleGender, paramOtherGender, paramClearanceList, paramPob, paramPhoneType, paramEmailType, paramEmailDomain, paramHealth);
    const numberOfPersons = Math.min(document.getElementById('number-of-persons').value, listOfNames.length * listOfSurnames.length);
}

function generateRandomPersons(){
    const persons = [];
    for(let i = 0; i < paramNumberOfPersons; i++) {
        const randCountry = paramListOfCountries[Math.floor(Math.random() * paramListOfCountries.length)];
        const randGenderValue = Math.random() * 100;
        if(randGenderValue < paramMaleGender) {
            randGender = "Male";
        } else if(randGenderValue < paramMaleGender + paramFemaleGender) {
            randGender = "Female";
        } else  randGender = "Other";
        const randName = getRandomName(randCountry, randGender);
        const randEyeColor = paramListEyeColors[Math.floor(Math.random() * paramListEyeColors.length)];
        const randHairColor = paramListHairColors[Math.floor(Math.random() * paramListHairColors.length)];
        const randDob = (new Date(paramDobFrom + Math.random() * (paramDobTo - paramDobFrom))).toISOString().split('T')[0];
        var randGender;
        
        const randClearance = (paramClearanceList.length==0)?null:paramClearanceList[Math.floor(Math.random() * paramClearanceList.length)];
        const randNationality = (randCountry.length==2)?randCountry:null;
        const randPhoneNumber = (paramPhoneType=='blank')?null:generateRandomPhoneNumber(paramPhoneType, randCountry);
        var randEmail = null;
        if(paramEmailType != 'blank'){
            randEmail = generateRandomEmail(randName, paramEmailDomain, paramEmailType);
        }
        const randHealth = (paramHealth.length==0)?null:paramHealth;
        persons.push({name:randName,  eye_colour:randEyeColor, hair_colour:randHairColor, dob: randDob,
            gender: randGender, clearance_level:randClearance, nationality:randNationality, phone_number:randPhoneNumber,
            email:randEmail, health:randHealth});
    }
    return persons;
}


function generateRandomEmail(randName, paramEmailDomain, paramEmailType){
    const nameParts = randName.split(" ");
    const firstName = nameParts[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`\'~()]/g,"");
    const lastName = nameParts[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`\'~()]/g,"");
    let email = null;
    if(paramEmailType == 'f1l9'){
        email = `${firstName.substring(0,1)}${lastName}@${paramEmailDomain}`;
    } else if(paramEmailType == 'l9f1'){
        email = `${lastName}${firstName.substring(0,1)}@${paramEmailDomain}`;
    } else if(paramEmailType == 'l9f9'){
        email = `${lastName}${firstName}@${paramEmailDomain}`;
    } else if(paramEmailType == 'f9l9'){
        email = `${firstName}${lastName}@${paramEmailDomain}`; 
    } else if(paramEmailType == 'l9dotf9'){
        email = `${lastName}.${firstName}@${paramEmailDomain}`;
    } else if(paramEmailType == 'f9dotl9'){
        email = `${firstName}.${lastName}@${paramEmailDomain}`;
    }
    return email;
}


function getRandomName(country, gender) {
    var names;
    if(gender.toLowerCase().startsWith("m")){
        names = filteredNamesMale.filter(name => name.country === country);
    } else if(gender.toLowerCase().startsWith("f")){
        names = filteredNamesFemale.filter(name => name.country === country);
    } else {
        names = filteredNamesMale.concat(filteredNamesFemale).filter(name => name.country === country);
    }
    const randomIndexName = Math.floor(Math.random() * names.length);
    const surnames = filteredSurnames.filter(surname => surname.country === country);
    const randomIndexSurname = Math.floor(Math.random() * surnames.length);
    return names[randomIndexName].name+" "+surnames[randomIndexSurname].surname;
}

function setGenderValues(){  
    const m = parseFloat(maleGenderValue.value);
    const f = parseFloat(femaleGenderValue.value);
    const o = parseFloat(otherGenderValue.value);
    
    const newM = 100*m/(m+f+o);
    const newF = 100*f/(m+f+o);
    const newO = 100*o/(m+f+o);
    
    maleGenderValue.value = newM;
    femaleGenderValue.value = newF;
    otherGenderValue.value = newO;
    maleGenderLabel.innerHTML = Math.round(maleGenderValue.value) + "%";
    femaleGenderLabel.innerHTML = Math.round(femaleGenderValue.value) + "%";
    otherGenderLabel.innerHTML = Math.round(otherGenderValue.value) + "%";
}

function handleSelectorEmailChange() {
    console.log('Email selector changed:', selectorEmail.value);
    if(selectorEmail.value == 'blank'){
        document.getElementById('emaildomain').style.display = 'none';
        document.getElementById('emailsymbol').style.display = 'none';
        } else {
        document.getElementById('emaildomain').style.display = '';
        document.getElementById('emailsymbol').style.display = '';
        }
}

function oldgeneratePersons(){
    loadParameters();
    fetch(namesFile)
        .then(response => response.json())
        .then(data => {
            const nameList = document.getElementById('name-list');
            nameList.innerHTML = ''; // Clear existing names
            const listSize = data.length;
            const numberOfPersons = Math.min(document.getElementById('number-of-persons').value, listSize);
            console.log(listSize);
            const randomIndices = new Set();
            while (randomIndices.size < numberOfPersons) {
                const randomIndex = Math.floor(Math.random() * listSize);
                randomIndices.add(randomIndex);
            }
            randomIndices.forEach(index => {
                const li = document.createElement('li');
                li.textContent = data[index].name;
                nameList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching names:', error));
    openTab(null, 'name-list')
}

async function countNamesPerCountry() {
    listOfNames = await loadJSON(namesFile);
    countNames = sortEntries(countEntries(listOfNames, 'country'), 'country');

    postEntriesInTable(countNames, 'names-country-count');
}

async function countSurnamesPerCountry() {
    listOfSurnames = await loadJSON(surnamesFile);
    countSurnames = sortEntries(countEntries(listOfSurnames, 'country'), 'country');
    postEntriesInTable(countSurnames, 'surnames-country-count');
}



function sortEntries(data, columnToSort) {
    return Object.entries(data).sort((el1,el2) => {
        if (typeof el1[1][columnToSort] === 'number' && typeof el2[1][columnToSort] === 'number') {
            return el1[1][columnToSort] - el2[1][columnToSort]; // Sort numerically in descending order
        } else if (typeof el1[1][columnToSort] === 'string' && typeof el2[1][columnToSort] === 'string') {
            return el1[1][columnToSort].localeCompare(el2[1][columnToSort]); // Sort alphabetically
        }
        return 0;
    }).map(([key, value]) => ({ [columnToSort]: key, ...value }));
}

function countEntries(data, columnToCount) {
    const counted = data.reduce((acc, entry) => {
        const key = entry[columnToCount];
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const countedArray = Object.entries(counted).map(([key, value]) => ({ [columnToCount]: key, count: value }));
    return countedArray;
}

function tableFromEntries(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headerTitles = Object.keys(data[0]);
    headerTitles.forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    data.forEach(entry => {
        const row = document.createElement('tr');
        Object.values(entry).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });
    return table; 
}

async function loadJSON(fileName) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        return console.error('Error fetching JSON:', error);
    }
}

function postEntriesInTable(entriesToPost, elementID) {
    const countryList = document.getElementById(elementID);
    countryList.innerHTML = ''; // Clear existing countries
    const table = tableFromEntries(entriesToPost);
    countryList.appendChild(table);    
}

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if(evt != null){
        evt.currentTarget.className += " active";
    } else {
        document.getElementById("btn"+tabName).className += " active";
    }
}

var testlist = [{label:"a", value:1}, {label:"b", value:1}, {label:"c", value:1}, {label:"d", value:1}, {label:"e", value:1}];
randomFromList(testlist);
randomFromList(testlist);



function randomFromList(list) {
    const total = list.reduce((acc, entry) => acc + entry.value, 0);
    var randomValue = Math.random() * total;
    var accumulatedValue = 0;
    list.forEach(entry => {
        accumulatedValue += entry.value;
        if (randomValue <= accumulatedValue) {
            console.log(entry.label);
            return entry.label;
        }
    });

}