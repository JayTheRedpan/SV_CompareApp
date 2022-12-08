 var charScaler = 5;
 
//on page load
window.onload = function() {
    loadCharacters();
  };

 //pull all character data from characters json
async function getCharData() {
    const response = await fetch('./characters.json');
    
    return response.json();
}

//gets specific character data based on name
async function getChar(charName){
    const characters = await getCharData();
    var charData

    //search through character json for selected character
    for (var i=0 ; i < characters.length ; i++)
    {
        if (characters[i]["name"] == charName) {
            charData = characters[i];
        }
    }

    console.log(charData);

    return charData;
}

//update drop downs with characters from json
async function loadCharacters(){
    const characters = await getCharData();
    const select1 = document.getElementById('char1select');
    const select2 = document.getElementById('char2select');

    for (var i=0 ; i < characters.length ; i++)
    {
        var opt1 = document.createElement('option');
        opt1.value = characters[i].name;
        opt1.text = characters[i].name[0].toUpperCase() + characters[i].name.substring(1);
        select1.add(opt1);

        var opt2 = document.createElement('option');
        opt2.value = characters[i].name;
        opt2.text = characters[i].name[0].toUpperCase() + characters[i].name.substring(1);
        select2.add(opt2);
    }
}

//scale characters based off of largest
async function sizeScale(){
    var char1 = await getChar(document.getElementById('char1select').value);
    var char2 = await getChar(document.getElementById('char2select').value);

    var maxSize = 0;

    //find larger characters height
    try{
        if ((char1.height * char1.height_correction) > (char2.height * char2.height_correction)){
            maxSize = (char1.height * char1.height_correction);
        }
        else{
            maxSize = (char2.height * char2.height_correction);
        }
    }
    catch{
        maxSize = 0
    }

    //adjust charactrs based off of bigger character height
    var ref1Img = document.getElementById('ref1img');
    var ref2Img = document.getElementById('ref2img');

    if (maxSize >= 500){
        var sizeScalar = 0.5;
        ref1Img.style.height = (sizeScalar * (char1.height_correction * char1.height)) + 'px';
        ref2Img.style.height = (sizeScalar * (char2.height_correction * char2.height)) + 'px';
        console.log("Scaled by: " + sizeScalar);
    }
    else if (maxSize >= 200){
        var sizeScalar = 3;
        ref1Img.style.height = (sizeScalar * (char1.height_correction * char1.height)) + 'px';
        ref2Img.style.height = (sizeScalar * (char2.height_correction * char2.height)) + 'px';
        console.log("Scaled by: " + sizeScalar);
    }
    else if (maxSize >= 100){
        var sizeScalar = 6;
        ref1Img.style.height = (sizeScalar * (char1.height_correction * char1.height)) + 'px';
        ref2Img.style.height = (sizeScalar * (char2.height_correction * char2.height)) + 'px';
        console.log("Scaled by: " + sizeScalar);
    }
    else{
        var sizeScalar = 8;
        ref1Img.style.height = (sizeScalar * (char1.height_correction * char1.height)) + 'px';
        ref2Img.style.height = (sizeScalar * (char2.height_correction * char2.height)) + 'px';
        console.log("Scaled by: " + sizeScalar);
    }

}

//updates character 1 after a selection is made
async function updateChar1(){
    //variable declaration
    var charName = document.getElementById('char1select').value;
    const characters = await getCharData();
    var charData = await getChar(charName);

    var profileImg = document.getElementById('profile1img');
    var refImg = document.getElementById('ref1img');
    
    //update profile images and size according to character size
    profileImg.src = "./images/head/" + charName + ".png";
    //profileImg.style.width = 

    //update ref images and size according to character size
    refImg.src = "./images/ref/" + charName + ".png";

    //scale pics
    await sizeScale();
}

//updates character 2 after a selection is made
async function updateChar2(){
    //variable declaration
    var charName = document.getElementById('char2select').value;
    const characters = await getCharData();
    var charData = await getChar(charName);

    var profileImg = document.getElementById('profile2img');
    var refImg = document.getElementById('ref2img');
    
    //update profile images and size according to character size
    profileImg.src = "./images/head/" + charName + ".png";
    //profileImg.style.width = 

    //update ref images and size according to character size
    refImg.src = "./images/ref/" + charName + ".png";

    //scale pics
    await sizeScale();
}