const namesFile = 'names.json'; // Source: https://github.com/railsmechanic/firstnames-to-gender/blob/master/names.json
const surnamesFile = 'surnames.json'; // Source: https://github.com/sigpwned/popular-names-by-country-dataset/blob/main/common-surnames-by-country.csv
const countriesFile = 'countries.json'; // Source: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/tree/master/all
const eyeColors = [{label:"Brown", value:6}, {label:"Blue", value:2}, {label:"Green", value:3}, {label:"Gray", value:1}, {label:"Hazel", value:2}];
const hairColors = [{label:"Brown", value:6}, {label:"Black", value:2}, {label:"Blonde", value:3}, {label:"Red", value:1}, {label:"Gray", value:3}];
var validCountries;
var listOfNames, listOfSurnames, listOfCountries;
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
loadCountries();


window.onload = async function() { 
    await countNamesPerCountry();
    await countSurnamesPerCountry();
    var setCountryNames = new Set();
    var setCountrySurnames = new Set();
    countNames.forEach(entry => {setCountryNames.add(entry.country)});
    countSurnames.forEach(entry => {setCountrySurnames.add(entry.country)});
    validCountries = [];
    setCountryNames.forEach(country => {
        if(setCountrySurnames.has(country)){
            validCountries.push({label:country, value:1});
        }
    });

    openTab(null, 'parameters');
    numberOfPersonsValue = document.getElementById('number-of-persons');
    countryOriginValue = document.getElementById("country-origin");
    countryOriginValue.appendChild(listOfPercentiles(validCountries, 'country-origin'));
    countryOriginValue.style.display = "none";
    eyeColorValue = document.getElementById("eye-colors");
    eyeColorValue.appendChild(listOfPercentiles(eyeColors, 'eye-colors'));
    eyeColorValue.style.display = "none";
    hairColorValue = document.getElementById("hair-colors");
    hairColorValue.appendChild(listOfPercentiles(hairColors, 'hair-colors'));
    hairColorValue.style.display = "none";
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

function toggleEyeColors() {
    if (eyeColorValue.style.display === "none") {
        eyeColorValue.style.display = "block";
    } else {
        eyeColorValue.style.display = "none";
    }
}

function toggleHairColors() {
    if (hairColorValue.style.display === "none") {
        hairColorValue.style.display = "block";
    }
    else {
        hairColorValue.style.display = "none";
    }
}

function toggleCountryOrigin() {
    if (countryOriginValue.style.display === "none") {
        countryOriginValue.style.display = "block";
    }
    else {
        countryOriginValue.style.display = "none";
    }
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
    
    paramListOfCountries = getPercentiles('country-origin');
    var listOfCountries = paramListOfCountries.map(entry => entry.label);
    filteredNamesMale = listOfNames.filter(name => listOfCountries.includes(name.country) && (name.gender=="male" || name.gender=="unisex"));
    filteredNamesFemale = listOfNames.filter(name => listOfCountries.includes(name.country) && (name.gender=="female" || name.gender=="unisex"));
    filteredSurnames = listOfSurnames.filter(surname => listOfCountries.includes(surname.country));
    paramNumberOfPersons = Math.max(1,parseInt(numberOfPersonsValue.value));
    paramListEyeColors = getPercentiles('eye-colors');
    paramListHairColors = getPercentiles('hair-colors');
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
    //console.log(paramListOfCountries, paramNumberOfPersons, paramListEyeColors, paramListHairColors, paramDobFrom, paramDobTo, paramMaleGender, paramFemaleGender, paramOtherGender, paramClearanceList, paramPob, paramPhoneType, paramEmailType, paramEmailDomain, paramHealth);
    //const numberOfPersons = Math.min(document.getElementById('number-of-persons').value, listOfNames.length * listOfSurnames.length);
}

function generateRandomPersons(){
    const persons = [];
    for(let i = 0; i < paramNumberOfPersons; i++) {
        const randCountry = randomFromList(paramListOfCountries);
        const randGenderValue = Math.random() * 100;
        if(randGenderValue < paramMaleGender) {
            randGender = "Male";
        } else if(randGenderValue < paramMaleGender + paramFemaleGender) {
            randGender = "Female";
        } else  randGender = "Other";
        const randName = getRandomName(randCountry, randGender);
        const randEyeColor = randomFromList(paramListEyeColors);
        const randHairColor = randomFromList(paramListHairColors);
        const randDob = (new Date(paramDobFrom + Math.random() * (paramDobTo - paramDobFrom))).toISOString().split('T')[0];
        var randGender;
        
        const randClearance = (paramClearanceList.length==0)?null:paramClearanceList[Math.floor(Math.random() * paramClearanceList.length)];
        const randNationality = randCountry;
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

function randomFromList(list) {
    const total = list.reduce((acc, entry) => acc + entry.value, 0);
    var randomValue = Math.random() * total;
    var accumulatedValue = 0;
    var result = null;
    var found = false;
    list.forEach(entry => {
        accumulatedValue += entry.value;
        if (!found && randomValue <= accumulatedValue) {
            result = entry.label;
            found = true;
        }
    });
    return result;
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
    if(names.length == 0){
        console.log(country, gender);
        console.log(filteredNamesMale);
        console.log(filteredNamesFemale);
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

function convertCountryCodeToName(list, fieldName){
    const convertedList = list.map(entry => {
        const countryCode = entry[fieldName].toLowerCase();
        const countryName = listOfCountries[countryCode]?.name || countryCode;
        return {...entry, [fieldName]: countryName};
    });
    return convertedList;
}

async function countNamesPerCountry() {
    listOfNames = await loadJSON(namesFile);
    listOfNames = convertCountryCodeToName(listOfNames, 'country');
    countNames = sortEntries(countEntries(listOfNames, 'country'), 'country');
    postEntriesInTable(countNames, 'names-country-count');
}

async function countSurnamesPerCountry() {
    listOfSurnames = await loadJSON(surnamesFile);
    listOfSurnames = convertCountryCodeToName(listOfSurnames, 'country');
    countSurnames = sortEntries(countEntries(listOfSurnames, 'country'), 'country');
    postEntriesInTable(countSurnames, 'surnames-country-count');
}

async function loadCountries() {
    const countries = await loadJSON(countriesFile);
    listOfCountries = new Object();
    countries.forEach(country => {
        const countryCode = country["alpha-2"].toLowerCase();
        const countryName = country.name;
        const countryRegion = country.region;
        listOfCountries[countryCode] = {name:countryName, region:countryRegion};
    });
    //console.log(listOfCountries);
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

function listOfPercentiles(data, name){
    const totalValues = data.reduce((acc, entry) => acc + entry.value, 0);
    const div = document.createElement('div');
    const table = document.createElement('table');
    table.id = name;
    const headerRow = document.createElement('tr');
    const buttonInvert = document.createElement('button');
    buttonInvert.textContent = "Invert Selection";
    buttonInvert.onclick = function() {
        invertSelection(name);
    };
    const buttonSelectAll = document.createElement('button');
    buttonSelectAll.textContent = "Select All";
    buttonSelectAll.onclick = function() {
        selectAll(name);
    }
    const buttonDeselectAll = document.createElement('button');
    buttonDeselectAll.textContent = "Clear Selection";
    buttonDeselectAll.onclick = function() {
        deselectAll(name);
    }
    const th0 = document.createElement('th');
    headerRow.appendChild(th0);
    const th1 = document.createElement('th');
    th1.appendChild(buttonInvert);
    headerRow.appendChild(th1);
    const th2 = document.createElement('th');
    th2.appendChild(buttonSelectAll);
    headerRow.appendChild(th2);
    const th3 = document.createElement('th');
    th3.appendChild(buttonDeselectAll);
    headerRow.appendChild(th3);
    
    table.appendChild(headerRow);
    data.forEach(entry => {
        const row = document.createElement('tr');
        const td1 = document.createElement('td'); // Checbox
        const td2 = document.createElement('td'); // Label
        const td3 = document.createElement('td'); // Slider
        const td4 = document.createElement('td'); // Percentage
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = "check"+entry.label;
        checkbox.oninput = function() {
            adjustPercentiles(name);
        };
        td1.appendChild(checkbox);
        td2.textContent = entry.label;
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.step = 0.05;
        slider.value = 100*entry.value/totalValues;
        slider.id = "slider"+entry.label;
        slider.oninput = function() {
            adjustPercentiles(name);
        };
        td3.appendChild(slider);
        td4.textContent = Math.round(100*entry.value/totalValues) + "%";
        td4.id = "percent"+entry.label;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
        table.appendChild(row);
    });
    div.appendChild(table);
    return div;
};

function adjustPercentiles(tableName){
    const table = document.getElementById(tableName);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    const sliders = table.querySelectorAll('input[type="range"]');
    const percentLabels = table.querySelectorAll('td[id^="percent"]');
    let totalChecked = 0;
    let totalValue = 0;
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            totalChecked++;
            totalValue += parseFloat(sliders[index].value);
            sliders[index].style.display = "";
        } else {
            sliders[index].style.display = "none";
        }
    });
    percentLabels.forEach((label, index) => {
        if (checkboxes[index].checked) {
            label.textContent = Math.round(100 * sliders[index].value / totalValue) + "%";
        } else {
            label.textContent = "0%";
        }
    });
}

function getPercentiles(tableName){
    const table = document.getElementById(tableName);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    const sliders = table.querySelectorAll('input[type="range"]');
    let totalChecked = 0;
    let totalValue = 0;
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            totalChecked++;
            totalValue += parseFloat(sliders[index].value);
        }
    });
    const percentiles = Array.from(checkboxes).map((checkbox, index) => {
        if (checkbox.checked) {
            return {label: checkbox.id.replace("check", ""), value: parseFloat(sliders[index].value) / totalValue};
        } else {
            return {label: checkbox.id.replace("check", ""), value: 0};
        }
    });
    return percentiles;
}

function invertSelection(tableName){
    const table = document.getElementById(tableName);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = !checkbox.checked;
    });
    checkboxes[0].dispatchEvent(new Event('input'));
}

function selectAll(tableName){
    const table = document.getElementById(tableName);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
    });
    checkboxes[0].dispatchEvent(new Event('input'));
}

function deselectAll(tableName){
    const table = document.getElementById(tableName);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    checkboxes[0].dispatchEvent(new Event('input'));
}


class SortableTable {
    constructor(data, divID) {
        this.divID = divID;
        this.data = data;
        this.sortColumn = null;
        this.sortDirection = 'asc'; // 'asc' or 'desc'
        this.table = this.getTable();
        const divOfTable = document.getElementById(this.divID);
        if(!divOfTable){
            console.error("Div with ID " + this.divID + " not found.");
            return;
        }
        divOfTable.innerHTML = '';
        divOfTable.appendChild(this.table);
    }
    getTable(){
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headerTitles = Object.keys(this.data[0]);
        headerTitles.forEach(title => {
            const th = document.createElement('th');
            th.textContent = title.charAt(0).toUpperCase() + title.slice(1);
            th.onclick = () => this.sortTable(title);
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        this.data.forEach(entry => {
            const row = document.createElement('tr');
            Object.values(entry).forEach(value => {
                const td = document.createElement('td');
                if(value != null && !isNaN(value)){
                    td.style.textAlign = "right";
                    value = value.toLocaleString();
                }
                td.textContent = value;
                row.appendChild(td);
            });
            table.appendChild(row);
        });
        return table; 
    }
    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        }
        this.sortColumn = column;
        this.data.sort((a, b) => {
            if (typeof a[column] === 'number' && typeof b[column] === 'number') {
                return this.sortDirection === 'asc' ? a[column] - b[column] : b[column] - a[column];
            } else if (typeof a[column] === 'string' && typeof b[column] === 'string') {
                return this.sortDirection === 'asc' ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
            }
            return 0;
        });
        this.updateTable();
    }
    updateTable() {
        this.table = this.getTable();
        const divOfTable = document.getElementById(this.divID);
        divOfTable.innerHTML = '';
        divOfTable.appendChild(this.table);
    }
}


function tableFromEntries(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headerTitles = Object.keys(data[0]);
    headerTitles.forEach(title => {
        const th = document.createElement('th');
        th.textContent = title.charAt(0).toUpperCase() + title.slice(1);
        th.onclick = sortTable;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    data.forEach(entry => {
        const row = document.createElement('tr');
        Object.values(entry).forEach(value => {
            const td = document.createElement('td');
            if(value != null && !isNaN(value)){
                td.style.textAlign = "right";
                value = value.toLocaleString();
            }
       
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });
    return table; 
}

function sortTable(event){
    var parent = event.target;
    while (parent.tagName != "TABLE") {
        parent = parent.parentElement;
        console.log(parent.tagName);
    }
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
    
    const tableClass = new SortableTable(entriesToPost, elementID);
      
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



    

// var testlist = [{label:"a", value:1}, {label:"b", value:1}, {label:"c", value:1}, {label:"d", value:1}, {label:"e", value:1}];
// randomFromList(testlist);
// randomFromList(testlist);



// function randomFromList(list) {
//     const total = list.reduce((acc, entry) => acc + entry.value, 0);
//     var randomValue = Math.random() * total;
//     var accumulatedValue = 0;
//     list.forEach(entry => {
//         accumulatedValue += entry.value;
//         if (randomValue <= accumulatedValue) {
//             return entry.label;
//         }
//     });
// }