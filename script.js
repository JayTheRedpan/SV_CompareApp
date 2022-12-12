 var charactersData;

 //pull data fom json
async function getJSON(path) {
    const response = await fetch(path);
    
    return response.json();
}

//gets specific character data based on name
function getChar(charID, log = true){
    var charData;

    //search through character json for selected character
    if(charID != "custom1" && charID != "custom2"){
        for (var i=0 ; i < charactersData.length ; i++)
        {
            if (charactersData[i]["id"] == charID) {
                charData = charactersData[i];
            }
        }
    }
    else if (charID == "custom1"){
        charData={
            "id":"custom1",
            "display_name": document.getElementById('customName1').value,
            "height": parseFloat(document.getElementById('customHeightFt1').value * 12) + parseFloat(document.getElementById('customHeightIn1').value),
            "height_correction": parseFloat(document.getElementById('customHeightCorrect1').value) / 100
        };
    }
    else if (charID == "custom2"){
        charData={
            "id":"custom2",
            "display_name": document.getElementById('customName2').value,
            "height": parseFloat(document.getElementById('customHeightFt2').value * 12) + parseFloat(document.getElementById('customHeightIn2').value),
            "height_correction": parseFloat(document.getElementById('customHeightCorrect2').value) / 100
        };
    }
    else {

    }

    if(log){console.log(charData);}

    return charData;
}

//load charactersData from JSON and populate drop downs
async function loadCharacters(){
    //pull data about characters and size tiers
    charactersData = await getJSON('./characters.json');
    const tiers = await getJSON('./tiers.json');
    var selectEntries = charactersData.concat(tiers);
    const select1 = document.getElementById('char1select');
    const select2 = document.getElementById('char2select');

    //sort select list by height
    selectEntries.sort(sortByProperty('height'));

    //update drop downs
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
function sizeScale(){
    var char1 = getChar(document.getElementById('char1select').value, false);
    var char2 = getChar(document.getElementById('char2select').value, false);
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

    document.getElementById('scaleRange').value = sizeScalar;
    height1img.style.height = (sizeScalar * char1Height) + 'px';
    height2img.style.height = (sizeScalar * char2Height) + 'px';

    //Adjust columsn based on smaller characters width
    // if (height1img.width < height2img.width){
    //     document.getElementById('char1HeightCol').style.width = (height1img.width + 20) + 'px';
    //     document.getElementById('char2HeightCol').style.width = '';
    //     console.log('set to char 1 width');
    // }else if (height1img.width > height2img.width){
    //     document.getElementById('char2HeightCol').style.width = (height2img.width + 20)+ 'px';
    //     document.getElementById('char1HeightCol').style.width = '';
    //     console.log('set to char 2 width');
    // } else {
    //     document.getElementById('char1HeightCol').style.width = '50%';
    //     document.getElementById('char2HeightCol').style.width = '50%';
    // }

    console.log("Scaled by: " + sizeScalar);

}

//update character
function updateCharacter(targetChar){
    updateCharHeight(targetChar);
    sizeScale();
}

//updates character height tab
function updateCharHeight(targetChar){
    //variable declaration
    var charID = document.getElementById('char' + targetChar +'select').value;
    var charData = getChar(charID);

    var heightImg = document.getElementById('height' + targetChar +'Img');
    
    //handle custom link
    var customElement;
    if (charID=="custom1"){customElement = 'customImage1'}
    else{customElement = 'customImage2'}
    var customLink = document.getElementById(customElement).value;
    var customLinkExtension = customLink.substring(customLink.length-4, customLink.length);
    var imgExtensions = ["jpeg", ".jpg", ".png"];

    //update stats
    document.getElementById('char' + targetChar +'Name').innerHTML = charData.display_name;
    document.getElementById('char' + targetChar +'Height').innerHTML = Math.floor(charData.height/12) + "' ";
    document.getElementById('char' + targetChar +'Height').innerHTML += charData.height % 12 + '"';
    
    //update image
    if((charID == "custom1" || charID == "custom2") && customLink != '' && imgExtensions.includes(customLinkExtension)){
        heightImg.crossorigin="anonymous";
        heightImg.src = customLink;
    }
    else{heightImg.src = "./images/height/" + charData.id + ".png";}
}

//updtades character length tab



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

function adjustScale(){
    var char1 = getChar(document.getElementById('char1select').value, false);
    var char2 = getChar(document.getElementById('char2select').value, false);
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
    var height1img = document.getElementById('height1Img');
    var height2img = document.getElementById('height2Img');
    var sizeScalar;

    sizeScalar = document.getElementById('scaleRange').value;
    height1img.style.height = (sizeScalar * char1Height) + 'px';
    height2img.style.height = (sizeScalar * char2Height) + 'px';

    console.log('Scaled by: ' + sizeScalar);
}

function swapChars(){
    var char1 = document.getElementById('char1select').value;

    document.getElementById('char1select').value = document.getElementById('char2select').value;
    document.getElementById('char2select').value = char1;

    updateCharacter(1);
    updateCharacter(2);
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