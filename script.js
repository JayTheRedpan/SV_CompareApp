 //-------- Global Variables -----------
 var charactersData;
 var char1 = {
    "id": "",        
    "display_name": "Choose a Character",
    "height": 0,
    "height_correction": 1,
    "length": 0
};
 var char2 = {
    "id": "",        
    "display_name": "Choose a Character",
    "height": 0,
    "height_correction": 1,
    "length": 0
};

//-------- Character Controls -----------------

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

//update character
function updateCharacter(targetChar, log = true){
    const char1Select = document.getElementById('char1select').value;
    const char2Select = document.getElementById('char2select').value;
    
    //update character global data
    if(targetChar == "1" && char1Select != ""){char1 = getChar(char1Select, log);}
    else if(targetChar == "2" && char2Select != ""){char2 = getChar(char2Select, log);}

    //update character height image/stats
    updateCharHeight(targetChar);
    //adjustHeightWidths();
    
    //update character length images/stats

    
    //update character profile images/stats
}

function openTab(tabName){
    document.getElementById('heightTab').style.display = 'none';
    document.getElementById('lengthTab').style.display = 'none';
    document.getElementById('profileTab').style.display = 'none';
    document.getElementById('customTab').style.display = 'none';

    document.getElementById('heightButton').style.color = '#000';
    document.getElementById('lengthButton').style.color = '#000';
    document.getElementById('profileButton').style.color = '#000';
    document.getElementById('customButton').style.color = '#000';

    document.getElementById(tabName + 'Tab').style.display = 'block';
    document.getElementById(tabName + 'Button').style.color = 'blue';
}

function swapChars(){
    var char1 = document.getElementById('char1select').value;

    document.getElementById('char1select').value = document.getElementById('char2select').value;
    document.getElementById('char2select').value = char1;

    updateCharacter(1);
    updateCharacter(2);
}
//-------- Height Tab Stuff -----------------

//updates character height tab
function updateCharHeight(targetChar){
    //variable declaration
    var charData;
    var heightImg = document.getElementById('height' + targetChar +'Img');

    if(targetChar == 1){charData = char1;}
    else{charData = char2;}

    //handle custom link
    var customElement;
    if (charData.id=="custom1"){customElement = 'customImage1'}
    else{customElement = 'customImage2'}
    var customLink = document.getElementById(customElement).value;

    //update stats
    document.getElementById('char' + targetChar +'Name').innerHTML = charData.display_name;
    document.getElementById('char' + targetChar +'Height').innerHTML = Math.floor(charData.height/12) + "' ";
    document.getElementById('char' + targetChar +'Height').innerHTML += charData.height % 12 + '"';
    
    //update image
    if((charData.id == "custom1" || charData.id == "custom2") && customLink != ''){
        heightImg.crossorigin="anonymous";
        heightImg.src = customLink;
    }
    else{heightImg.src = "./images/height/" + charData.id + ".png";}
}

//draw characters to height canvas elements from base images
function drawHeights(manualZoom = 0){
    const canvas1 = document.getElementById('height1Canvas');
    const canvas2 = document.getElementById('height2Canvas');
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    var img1 = document.getElementById('height1Img');
    var img2 = document.getElementById('height2Img');
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;

    //clear canvas
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    //size canvases to character height
    scaleHeightCanvases(manualZoom);

    //custom character crop values
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;
    var toFilterColor;
    var filterR;
    var filterG;
    var filterB;
    var tolerance;

    //draw character 1
    toFilterColor = false;
    if (char1.id == 'custom1' && document.getElementById('customImage1').value != ''){
        cropTop = parseFloat(document.getElementById('cropImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL1').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck1').checked;
        filterR = parseInt(document.getElementById('removeBGColor1').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor1').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor1').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance1').value);
    }
    else if (char1.id == 'custom2' && document.getElementById('customImage2').value != ''){
        cropTop = parseFloat(document.getElementById('cropImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL2').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck2').checked;
        filterR = parseInt(document.getElementById('removeBGColor2').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor2').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor2').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance2').value);
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }

    ctx1.drawImage(
        img1,                                                 //image to draw
        img1.width * cropLeft,                                //x to start grab
        img1.height * cropTop,                                // y to start grab
        img1.width - (img1.width * (cropLeft + cropRight)),   //x distance to grab
        img1.height - (img1.height * (cropTop + cropBottom)), //y distance to grab
        0, 0,                                                 //where to place image
        canvas1.width, canvas1.height                         //size to scale placed image
    );
    
    if(toFilterColor){filterFromCanvas(canvas1, filterR, filterG, filterB, tolerance)}

    //draw character 2
    toFilterColor = false;
    if (char2.id == 'custom1' && document.getElementById('customImage1').value != ''){
        cropTop = parseFloat(document.getElementById('cropImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL1').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck1').checked;
        filterR = parseInt(document.getElementById('removeBGColor1').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor1').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor1').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance1').value);
    }
    else if (char2.id == 'custom2' && document.getElementById('customImage2').value != ''){
        cropTop = parseFloat(document.getElementById('cropImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL2').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck2').checked;
        filterR = parseInt(document.getElementById('removeBGColor2').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor2').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor2').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance2').value);
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }
        
    ctx2.drawImage(
        img2,                                                 //image to draw
        img2.width * cropLeft,                                //x to start grab
        img2.height * cropTop,                                // y to start grab
        img2.width - (img2.width * (cropLeft + cropRight)),   //x distance to grab
        img2.height - (img2.height * (cropTop + cropBottom)), //y distance to grab
        0, 0,                                                 //where to place image
        canvas2.width, canvas2.height                         //size to scale placed image
    );

    if(toFilterColor){filterFromCanvas(canvas2, filterR, filterG, filterB, tolerance)}
}

//adjust height canvas sizes based on character sizes
function scaleHeightCanvases(manualZoom){
    var char1Height = char1.height * char1.height_correction;
    var char2Height = char2.height * char2.height_correction;
    const canvas1 = document.getElementById('height1Canvas');
    const canvas2 = document.getElementById('height2Canvas');
    var img1 = document.getElementById('height1Img');
    var img2 = document.getElementById('height2Img');
    var maxSize;
    var zoom;

    //find larger characters height
    if (char1Height > char2Height){maxSize = char1Height;}
    else{maxSize = char2Height;}

    //calculate zoom based off of bigger character height
    if (manualZoom != 0) {zoom = manualZoom}
    else if (maxSize >= 500){zoom = 1;}
    else if (maxSize >= 200){zoom = 3;}
    else if (maxSize >= 100){zoom = 6;}
    else{zoom = 8;}

    //adjust canvas height based on character height and zoom
    document.getElementById('zoomRange').value = zoom;
    canvas1.height = (zoom * char1Height);
    canvas2.height = (zoom * char2Height);


    //adjust canvas widths to maintain aspect ratio
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;

    //canvas 1
    if (char1.id == 'custom1'){
        cropTop = parseFloat(document.getElementById('cropImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL1').value)/100;
    }
    else if (char1.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL2').value)/100;
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }
    
    canvas1.width = (parseFloat(img1.width - (img1.width * (cropLeft + cropRight)))/parseFloat(img1.height - (img1.height * (cropTop + cropBottom)))) * parseFloat(canvas1.height);

     //canvas 1
     if (char2.id == 'custom1'){
        cropTop = parseFloat(document.getElementById('cropImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL1').value)/100;
    }
    else if (char2.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropImageL2').value)/100;
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }
    
    canvas2.width = (parseFloat(img2.width - (img2.width * (cropLeft + cropRight)))/parseFloat(img2.height - (img2.height * (cropTop + cropBottom)))) * parseFloat(canvas2.height);
}

//adjust height column widths to better fit characters to screen
function adjustHeightWidths(){
    //Adjust columsn based on smaller characters width
    const col1 = document.getElementById('char1HeightCol');
    const col2 = document.getElementById('char2HeightCol');

    if (char1.height * char1.height_correction < char2.height * char2.height_correction){
        col1.style.width = '30%';
        col2.style.width = '70%';
        console.log('Column 1 Shrunk');
    }else if (char1.height * char1.height_correction > char2.height * char2.height_correction){
        col1.style.width = '70%';
        col2.style.width = '30%';
        console.log('Column 2 Shrunk');
    } else {
        col1.style.width = '50%';
        col2.style.width = '50%';
        console.log('Columns set equal');
    }
}

function adjustZoom(){
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

    sizeScalar = document.getElementById('zoomRange').value;
    height1img.style.height = (sizeScalar * char1Height) + 'px';
    height2img.style.height = (sizeScalar * char2Height) + 'px';

    drawHeights(sizeScalar);

    console.log('Scaled by: ' + sizeScalar);
}

function updateHeightBG(){
    const bgColor = document.getElementById('heightBGColor').value;
    const bg1 = document.getElementById('height1ImgCell');
    const bg2 = document.getElementById('height2ImgCell');

    bg1.style.backgroundColor = bgColor;
    bg2.style.backgroundColor = bgColor;
}
//-------- Length Tab Stuff -----------------


//-------- Profile Tab Stuff -----------------


//-------- Custom Tab Stuff -----------------
function updatePreview(){
    if(document.getElementById('customImage1').value != ''){updateCustomCanvas(1);}
    if(document.getElementById('customImage2').value != ''){updateCustomCanvas(2);}
}

function adjustCrop(targetCrop, barToBox = true){
    const cropBox = document.getElementById('cropImage' + targetCrop);
    const cropBar = document.getElementById('cropImageRange' + targetCrop);

    if(barToBox){cropBox.value = cropBar.value;}
    else{cropBar.value = cropBox.value;}

    updatePreview(targetCrop.charAt(1));
}

function updateCustomCanvas(targetCanv){
    const canvas = document.getElementById('customCanvas' + targetCanv);
    const ctx = canvas.getContext('2d');
    const customLink = document.getElementById('customImage' + targetCanv).value;
    const container = document.getElementById('customRight' + targetCanv);
    var cropTop = parseFloat(document.getElementById('cropImageT' + targetCanv).value)/100;
    var cropRight = parseFloat(document.getElementById('cropImageR' + targetCanv).value)/100;
    var cropBottom = parseFloat(document.getElementById('cropImageB' + targetCanv).value)/100;
    var cropLeft = parseFloat(document.getElementById('cropImageL' + targetCanv).value)/100;

    //drawing image to preview canvas
    var img = new Image();
    img.onload = function () {
        //resize preview canvas based on image dimensions.  
        //Determine its biggest dimension, then scale the canvas to it inside the div
        if(img.width > img.height){
            canvas.width = parseFloat(container.clientWidth) * 0.95;
            canvas.height = (parseFloat(img.height) / parseFloat(img.width)) * parseFloat(canvas.width);
        }
        else{
            canvas.height = parseFloat(container.clientHeight) * 0.95;
            canvas.width = (parseFloat(img.width) / parseFloat(img.height)) * parseFloat(canvas.height);
        }

        //draw image to preview canvas
        ctx.drawImage(
            img,                            //image to draw
            0, 0,                           //x y to start grab
            img.width, img.height,          //x y distance to grab
            0, 0,                           //where to place image
            canvas.width, canvas.height   //size to scale placed image
        );

        //draw crop rectangles to prevew canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height * cropTop);  //top crop
        ctx.fillRect(canvas.width - (canvas.width * cropRight), 0, canvas.width * cropRight, canvas.height);  //right crop
        ctx.fillRect(0, canvas.height - (canvas.height * cropBottom), canvas.width, canvas.height * cropBottom);  //bottom crop
        ctx.fillRect(0, 0, canvas.width * cropLeft, canvas.height);  //left crop

        //draw lines over crop box edges
        ctx.beginPath();
        ctx.moveTo(canvas.width * cropLeft, canvas.height * cropTop); //left top
        ctx.lineTo(canvas.width - (canvas.width * cropRight), canvas.height * cropTop); //right top
        ctx.lineTo(canvas.width - (canvas.width * cropRight), canvas.height - (canvas.height * cropBottom)); //right bottom
        ctx.lineTo(canvas.width * cropLeft, canvas.height - (canvas.height * cropBottom)); //left bottom
        ctx.lineTo(canvas.width * cropLeft, canvas.height * cropTop); //left top
        ctx.strokeStyle = '#ff0000'; //color
        ctx.lineWidth = 2; //width
        ctx.stroke();  //draw to canvas
    };

    img.src = customLink;

}

//---- Toolbox Functions ----------
function filterFromCanvas(canvas, R, G, B, tolerance = 0){
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    tolerance = Math.abs(tolerance);

    for(let i = 0; i < imgData.data.length; i += 4){
        if((imgData.data[i] >= R - tolerance && imgData.data[i] <= R + tolerance)
        && (imgData.data[i + 1] >= G - tolerance && imgData.data[i + 1] <= G + tolerance) 
        && (imgData.data[i + 2] >= B - tolerance && imgData.data[i + 2] <= B + tolerance))
            imgData.data[i + 3] = 0;
    }

    ctx.putImageData(imgData, 0, 0);
}

async function getJSON(path) {
    const response = await fetch(path);
    
    return response.json();
}

function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
}

//---- Run at Load --------
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

loadCharacters();
openTab('height');