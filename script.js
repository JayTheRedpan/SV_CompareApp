 const charSize = 1;
 
 //pull all character data from characters json
async function getCharData() {
    const response = await fetch('./characters.json');
    
    return response.json();
}

//on page load
window.onload = function() {
    loadCharacters();
  };

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

//updates character 1 after a selection is made
async function updateChar1(){
    //variable declaration
    var charName = document.getElementById('char1select').value;
    const characters = await getCharData();
    var charData;

    var profileImg = document.getElementById('profile1img');
    var refImg = document.getElementById('ref1img');

    //search through character json for selected character
    for (var i=0 ; i < characters.length ; i++)
    {
        if (characters[i]["name"] == charName) {
            charData = characters[i];
        }
    }
    console.log(charData);
    
    //update profile images and size according to character size
    profileImg.src = "./images/head/" + charName + ".png";
    //profileImg.style.width = 

    //update ref images and size according to character size
    refImg.src = "./images/ref/" + charName + ".png";
    refImg.style.height = (document.getElementById('sizeselect').value * charData.height) + 'px';

}

//updates character 2 after a selection is made
async function updateChar2(){
    //variable declaration
    var charName = document.getElementById('char2select').value;
    const characters = await getCharData();
    var charData;

    var profileImg = document.getElementById('profile2img');
    var refImg = document.getElementById('ref2img');

    //search through character json for selected character
    for (var i=0 ; i < characters.length ; i++)
    {
        if (characters[i]["name"] == charName) {
            charData = characters[i];
        }
    }
    console.log(charData);
    
    //update profile images and size according to character size
    profileImg.src = "./images/head/" + charName + ".png";
    //profileImg.style.width = 

    //update ref images and size according to character size
    refImg.src = "./images/ref/" + charName + ".png";
    refImg.style.height = (document.getElementById('sizeselect').value * charData.height) + 'px';

}