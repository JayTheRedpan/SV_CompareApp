 

 //pull all character data from characters json
async function getJSON(path) {
    const response = await fetch(path);
    
    return response.json();
}

//gets specific character data based on name
async function getChar(charName, log = true){
    const characters = await getJSON('./characters.json');
    var charData

    //search through character json for selected character
    for (var i=0 ; i < characters.length ; i++)
    {
        if (characters[i]["id"] == charName) {
            charData = characters[i];
        }
    }

    if(log){console.log(charData);}

    return charData;
}

//update drop downs with characters from json
async function loadCharacters(){
    const characters = await getJSON('./characters.json');
    const tiers = await getJSON('./tiers.json');
    var selectEntries = characters.concat(tiers);
    const select1 = document.getElementById('char1select');
    const select2 = document.getElementById('char2select');

    selectEntries.sort(sortByProperty('height'));

    for (var i=0 ; i < selectEntries.length ; i++)
    {
        var opt1 = document.createElement('option');
        opt1.value = selectEntries[i].id;
        if(selectEntries[i].disabled){
            opt1.disabled = 'disabled';
            opt1.text = '--- ' + selectEntries[i].display_name + ' ---';
        }
        else {
            opt1.text = selectEntries[i].display_name;
        }
        select1.add(opt1);

        var opt2 = document.createElement('option');
        opt2.value = selectEntries[i].id;
        if(selectEntries[i].disabled){
            opt2.disabled = 'disabled';
            opt2.text = '--- ' + selectEntries[i].display_name + ' ---';
        }
        else {
            opt2.text = selectEntries[i].display_name;
        }
        select2.add(opt2);
    }
}

//scale characters based off of largest
async function sizeScale(){
    var char1 = await getChar(document.getElementById('char1select').value, false);
    var char2 = await getChar(document.getElementById('char2select').value, false);
    var char1Height = 0;
    var char2Height = 0;

    try{
        char1Height = char1.height * char1.height_correction;
    }catch{

    }
    try{
        char2Height = char2.height * char2.height_correction;
    }catch{

    }

    var maxSize = 0;

    //find larger characters height
    if (char1Height > char2Height){
        maxSize = char1Height;
    }
    else{
        maxSize = char2Height;
    }

    //adjust charactrs based off of bigger character height
    var height1img = document.getElementById('height1Img');
    var height2img = document.getElementById('height2Img');
    var sizeScalar = 1;

    if (maxSize >= 500){sizeScalar = 1;}
    else if (maxSize >= 200){sizeScalar = 3;}
    else if (maxSize >= 100){sizeScalar = 6;}
    else{sizeScalar = 8;}

    height1img.style.height = (sizeScalar * char1Height) + 'px';
    height2img.style.height = (sizeScalar * char2Height) + 'px';
    console.log("Scaled by: " + sizeScalar);

}

//updates character 1 after a selection is made
async function updateChar1(){
    //variable declaration
    var charName = document.getElementById('char1select').value;
    const characters = await getJSON('./characters.json');
    var charData = await getChar(charName);

    var lengthImg = document.getElementById('length1Img');
    var heightImg = document.getElementById('height1Img');
    
    //update profile images and size according to character size
    //lengthImg.src = "./images/head/" + charName + ".png";

    //update ref images and size according to character size
    document.getElementById('char1Name').innerHTML = charData.display_name;
    document.getElementById('char1Height').innerHTML = Math.floor(charData.height/12) + "' ";
    document.getElementById('char1Height').innerHTML += charData.height % 12 + '"';
    heightImg.src = "./images/height/" + charData.id + ".png";

    //scale pics
    await sizeScale();
}

//updates character 2 after a selection is made
async function updateChar2(){
    //variable declaration
    var charName = document.getElementById('char2select').value;
    const characters = await getJSON('./characters.json');
    var charData = await getChar(charName);

    var lengthImg = document.getElementById('length2Img');
    var heightImg = document.getElementById('height2Img');
    
    //update profile images and size according to character size
    //lengthImg.src = "./images/head/" + charName + ".png";

    //update ref images and size according to character size
    document.getElementById('char2Name').innerHTML = charData.display_name;
    document.getElementById('char2Height').innerHTML = Math.floor(charData.height/12) + "' ";
    document.getElementById('char2Height').innerHTML += charData.height % 12 + '"';
    heightImg.src = "./images/height/" + charData.id + ".png";

    //scale pics
    await sizeScale();
}

//Tab Updates
function openHeightTab(){
    document.getElementById('heightTab').style.display = 'block';
    document.getElementById('lengthTab').style.display = 'none';
    document.getElementById('profileTab').style.display = 'none';
    document.getElementById('customTab').style.display = 'none';

    document.getElementById('heightButton').style.color = 'blue';
    document.getElementById('lengthButton').style.color = '#000';
    document.getElementById('profileButton').style.color = '#000';
    document.getElementById('customButton').style.color = '#000';
}

function openLengthTab(){
    document.getElementById('heightTab').style.display = 'none';
    document.getElementById('lengthTab').style.display = 'block';
    document.getElementById('profileTab').style.display = 'none';
    document.getElementById('customTab').style.display = 'none';

    document.getElementById('heightButton').style.color = '#000';
    document.getElementById('lengthButton').style.color = 'blue';
    document.getElementById('profileButton').style.color = '#000';
    document.getElementById('customButton').style.color = '#000';
}

function openProfileTab(){
    document.getElementById('heightTab').style.display = 'none';
    document.getElementById('lengthTab').style.display = 'none';
    document.getElementById('profileTab').style.display = 'block';
    document.getElementById('customTab').style.display = 'none';

    document.getElementById('heightButton').style.color = '#000';
    document.getElementById('lengthButton').style.color = '#000';
    document.getElementById('profileButton').style.color = 'blue';
    document.getElementById('customButton').style.color = '#000';
}

function openCustomTab(){
    document.getElementById('heightTab').style.display = 'none';
    document.getElementById('lengthTab').style.display = 'none';
    document.getElementById('profileTab').style.display = 'none';
    document.getElementById('customTab').style.display = 'block';

    document.getElementById('heightButton').style.color = '#000';
    document.getElementById('lengthButton').style.color = '#000';
    document.getElementById('profileButton').style.color = '#000';
    document.getElementById('customButton').style.color = 'blue';
}

//Tool Functions
function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
 }

//Auto Run at Load
loadCharacters();
openHeightTab();