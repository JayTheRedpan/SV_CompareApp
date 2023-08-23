//-------- Global Variables -----------
var charactersData;
var useProxy = false;
var corsProxyURL = 'https://corsproxy.io/?';  //add URLencoded: + encodeURIComponent('https://api.domain.com/...')
//var corsProxyURL = "https://api.codetabs.com/v1/proxy?quest="; //old proxy
var activeTab = "";
var char1 = {
    "id": "blank",        
    "display_name": "Select a Character",
    "height": 0,
    "height_correction": 1,
    "length": 0,
    "length_correction": 1
};
 var char2 = {
    "id": "blank",        
    "display_name": "Select a Character",
    "height": 0,
    "height_correction": 1,
    "length": 0,
    "length_correction": 1
};

//sets up use of proxy for manipulating canvas images, or removes them for faster app use
function proxyCheck(){
    if(!document.getElementById('proxyCheck').disabled){
        var proxyElements = document.getElementsByClassName('proxyElement');
        var proxyImages = document.getElementsByClassName('proxyImage');
        
        if(document.getElementById('proxyCheck').checked){
            useProxy = true;
            for (var i = 0; i < proxyElements.length; ++i) {
                proxyElements[i].hidden = false;
            }
        }
        else{
            useProxy = false;
            for (var i = 0; i < proxyImages.length; ++i) {
                proxyImages[i].removeAttribute('crossorigin');
            }
        }
    }

    //decision must be locked to avoid tainting canvases with non proxy use
    document.getElementById('proxyCheck').disabled = true;
}

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
            "height_correction": parseFloat(document.getElementById('customHeightCorrect1').value) / 100,
            "length": parseFloat(document.getElementById('customLengthFt1').value * 12) + parseFloat(document.getElementById('customLengthIn1').value),
            "length_correction": parseFloat(document.getElementById('customLengthCorrect1').value) / 100
        };
    }
    else if (charID == "custom2"){
        charData={
            "id":"custom2",
            "display_name": document.getElementById('customName2').value,
            "height": parseFloat(document.getElementById('customHeightFt2').value * 12) + parseFloat(document.getElementById('customHeightIn2').value),
            "height_correction": parseFloat(document.getElementById('customHeightCorrect2').value) / 100,
            "length": parseFloat(document.getElementById('customLengthFt2').value * 12) + parseFloat(document.getElementById('customLengthIn2').value),
            "length_correction": parseFloat(document.getElementById('customLengthCorrect2').value) / 100
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
    if(targetChar == "1" && char1Select != "blank"){char1 = getChar(char1Select, log);}
    else if(targetChar == "2" && char2Select != "blank"){char2 = getChar(char2Select, log);}
    
    //handle blanks on character swap
    if(targetChar == "1" && char1Select == "blank"){
        char1 = {
        "id": "blank",        
            "display_name": "Select a Character",
            "height": 0,
            "height_correction": 1,
            "length": 0
        };
    }
    else if(targetChar == "2" && char2Select == "blank"){
        char2 = {
            "id": "blank",        
            "display_name": "Select a Character",
            "height": 0,
            "height_correction": 1,
            "length": 0
        };
    }

    //update character height image/stats
    if(activeTab == "height"){
        updateCharHeight(targetChar);
        //adjustHeightWidths();
    }

    //update character length images/stats
    if(activeTab == "length"){
        updateCharLength(targetChar);
    }
    
    //update character profile images/stats

}

function swapChars(){
    var char1 = document.getElementById('char1select').value;

    document.getElementById('char1select').value = document.getElementById('char2select').value;
    document.getElementById('char2select').value = char1;

    updateCharacter(1, false);
    updateCharacter(2, false);
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

    activeTab = tabName;
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
    if (charData.id=="custom1"){customElement = 'customHeightImageURL1'}
    else{customElement = 'customHeightImageURL2'}
    var customLink = document.getElementById(customElement).value;

    //update stats
    document.getElementById('char' + targetChar +'HeightName').innerHTML = charData.display_name;
    document.getElementById('char' + targetChar +'Height').innerHTML = inchesToText(charData.height);
    
    //update image
    if((charData.id == "custom1" || charData.id == "custom2") && customLink != ''){
        //check if using proxy
        if(useProxy){
            //add check to reduce proxy calls
            if(heightImg.src != corsProxyURL + encodeURIComponent(customLink)){
                heightImg.src = corsProxyURL + encodeURIComponent(customLink);
                console.log('PROXY HIT');
            }
            else{drawHeights();}
        }
        else{
            heightImg.src = customLink;
        }
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
    if (char1.id == 'custom1' && document.getElementById('customHeightImageURL1').value != ''){
        cropTop = parseFloat(document.getElementById('cropHeightImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL1').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck1').checked;
        filterR = parseInt(document.getElementById('removeBGColor1').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor1').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor1').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance1').value);
    }
    else if (char1.id == 'custom2' && document.getElementById('customHeightImageURL2').value != ''){
        cropTop = parseFloat(document.getElementById('cropHeightImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL2').value)/100;
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
    
    if(toFilterColor && useProxy){filterFromCanvas(canvas1, filterR, filterG, filterB, tolerance)}

    //draw character 2
    toFilterColor = false;
    if (char2.id == 'custom1' && document.getElementById('customHeightImageURL1').value != ''){
        cropTop = parseFloat(document.getElementById('cropHeightImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL1').value)/100;
        toFilterColor = document.getElementById('removeBGColorCheck1').checked;
        filterR = parseInt(document.getElementById('removeBGColor1').value.substring(1, 3), 16);
        filterG = parseInt(document.getElementById('removeBGColor1').value.substring(3, 5), 16);
        filterB = parseInt(document.getElementById('removeBGColor1').value.substring(5, 7), 16);
        tolerance = parseFloat(document.getElementById('removeTolerance1').value);
    }
    else if (char2.id == 'custom2' && document.getElementById('customHeightImageURL2').value != ''){
        cropTop = parseFloat(document.getElementById('cropHeightImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL2').value)/100;
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

    if(toFilterColor && useProxy){filterFromCanvas(canvas2, filterR, filterG, filterB, tolerance)}
}

//adjust height canvas sizes based on character sizes
function scaleHeightCanvases(manualZoom = 0){
    var char1Height = char1.height * char1.height_correction;
    var char2Height = char2.height * char2.height_correction;
    const canvas1 = document.getElementById('height1Canvas');
    const canvas2 = document.getElementById('height2Canvas');
    var img1 = document.getElementById('height1Img');
    var img2 = document.getElementById('height2Img');
    var maxSize;
    var zoom;

    //update images if using custom
    // if(char1.id == 'custom1' && document.getElementById('customHeightImageURL1').value != ''){img1 = customImage1;}
    // else if(char1.id == 'custom2' && document.getElementById('customHeightImageURL2').value != ''){img1 = customImage2;}
    // else if(char2.id == 'custom1' && document.getElementById('customHeightImageURL1').value != ''){img2 = customImage1;}
    // else if(char2.id == 'custom2' && document.getElementById('customHeightImageURL2').value != ''){img2 = customImage1;}

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
    document.getElementById('heightZoomRange').value = zoom;
    canvas1.height = (zoom * char1Height);
    canvas2.height = (zoom * char2Height);


    //adjust canvas widths to maintain aspect ratio
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;

    //canvas 1
    if (char1.id == 'custom1'){
        cropTop = parseFloat(document.getElementById('cropHeightImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL1').value)/100;
    }
    else if (char1.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropHeightImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL2').value)/100;
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
        cropTop = parseFloat(document.getElementById('cropHeightImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL1').value)/100;
    }
    else if (char2.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropHeightImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropHeightImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropHeightImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropHeightImageL2').value)/100;
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

function adjustHeightZoom(){
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

    sizeScalar = document.getElementById('heightZoomRange').value;
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

function getHeightImg(save = false){
    const canvas1 = document.getElementById('height1Canvas');
    const canvas2 = document.getElementById('height2Canvas');
    const clipboardCanvas = document.createElement("canvas");
    const ctx = clipboardCanvas.getContext("2d");
    const addBG = document.getElementById('addHeightBGCheck').checked;
    const addHeader = addHeightHeaderCheck.checked;
    const bgColor = document.getElementById('heightBGColor').value;

    var headerHeight; //percent
    var headerLowerMargin; //percent
    var textPercentofHeight = 3;

    if(addHeader){
        headerHeight = 20;
        headerLowerMargin = 5;
    }
    else{
        headerHeight = 0;
        headerLowerMargin = 0;
    }

    //set clip canvas dimensions and draw characters
    clipboardCanvas.width = canvas1.width + canvas2.width;
    
    if(canvas1.height > canvas2.height){
        clipboardCanvas.height = canvas1.height * (1 + (headerHeight/100));

        //draw BG Color
        ctx.clearRect(0,0, clipboardCanvas.width, clipboardCanvas.height);
        if(addBG){
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, clipboardCanvas.width, clipboardCanvas.height);
        }

        //draw characters
        ctx.drawImage(canvas1, 0, canvas1.height * (headerHeight/100));
        ctx.drawImage(canvas2, canvas1.width, clipboardCanvas.height - canvas2.height);

        //add header
        if(addHeader){
            //draw header bar
            ctx.fillStyle = '#FAEBD7';
            ctx.fillRect(0, 0, clipboardCanvas.width, canvas1.height * ((headerHeight - headerLowerMargin)/100));

            //draw character info
            ctx.font = Math.round(textPercentofHeight / 100 * clipboardCanvas.height) + "px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            //character 1
            ctx.fillText(char1.display_name, clipboardCanvas.width/3, canvas1.height * ((headerHeight - headerLowerMargin)/300));
            ctx.fillText(inchesToText(char1.height), clipboardCanvas.width/3, canvas1.height * (2 * (headerHeight - headerLowerMargin)/300));
            //character 2
            ctx.fillText(char2.display_name, (2 * clipboardCanvas.width)/3, canvas1.height * ((headerHeight - headerLowerMargin)/300));
            ctx.fillText(inchesToText(char2.height), (2 * clipboardCanvas.width)/3, canvas1.height * (2 * (headerHeight - headerLowerMargin)/300));
        }
        
    }
    else{
        clipboardCanvas.height = canvas2.height * (1 + (headerHeight/100));

        //draw BG Color
        ctx.clearRect(0,0, clipboardCanvas.width, clipboardCanvas.height);
        if(addBG){
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, clipboardCanvas.width, clipboardCanvas.height);
        }

        //draw characters
        ctx.drawImage(canvas1, 0, clipboardCanvas.height - canvas1.height);
        ctx.drawImage(canvas2, canvas1.width, canvas2.height * (headerHeight/100));

        //add header
        if(addHeader){
            //draw header bar
            ctx.fillStyle = '#FAEBD7';
            ctx.fillRect(0, 0, clipboardCanvas.width, canvas2.height * ((headerHeight - headerLowerMargin)/100));

            //draw character info
            ctx.font = Math.round(textPercentofHeight / 100 * clipboardCanvas.height) + "px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            //character 1
            ctx.fillText(char1.display_name, clipboardCanvas.width/3, canvas2.height * ((headerHeight - headerLowerMargin)/300));
            ctx.fillText(inchesToText(char1.height), clipboardCanvas.width/3, canvas2.height * (2 * (headerHeight - headerLowerMargin)/300));
            //character 2
            ctx.fillText(char2.display_name, (2 * clipboardCanvas.width)/3, canvas2.height * ((headerHeight - headerLowerMargin)/300));
            ctx.fillText(inchesToText(char2.height), (2 * clipboardCanvas.width)/3, canvas2.height * (2 * (headerHeight - headerLowerMargin)/300));
        }
    }

    //copy/save canvas to clipboard
    if(save){downloadCanvas(clipboardCanvas);}
    else{copyCanvasToClipboard(clipboardCanvas);}
}
//-------- Length Tab Stuff -----------------

//updates character length tab
function updateCharLength(targetChar){
    //variable declaration
    var charData;
    var lengthHeadImg = document.getElementById('length' + targetChar +'HeadImg');
    var lengthImg = document.getElementById('length' + targetChar +'Img');

    if(targetChar == 1){charData = char1;}
    else{charData = char2;}

    //handle custom link
    var customElement;
    if (charData.id=="custom1"){customElement = 'customLengthImageURL1'}
    else{customElement = 'customLengthImageURL2'}
    var customLink = document.getElementById(customElement).value;

    //update stats
    document.getElementById('char' + targetChar +'LengthName').innerHTML = charData.display_name;
    document.getElementById('char' + targetChar +'Length').innerHTML = inchesToText(charData.length);
    
    //update image
    if((charData.id == "custom1" || charData.id == "custom2") && customLink != ''){
        //check if using proxy
        if(useProxy){
            //add check to reduce proxy calls
            if(lengthImg.src != corsProxyURL + encodeURIComponent(customLink)){
                lengthImg.src = corsProxyURL + encodeURIComponent(customLink);
                console.log('PROXY HIT');
            }
            else{drawLengths();}
        }
        else{
            lengthImg.src = customLink;
        }
    }
    else{
        lengthImg.src = "./images/length/" + charData.id + ".png";
    }

    lengthHeadImg.src = "./images/head/" + charData.id + ".png"
}

//draw characters to lengthHead canvas elements from base images
function drawHeadLengths(manualZoom = 0){
    const canvas1 = document.getElementById('length1HeadCanvas');
    const canvas2 = document.getElementById('length2HeadCanvas');
    const container1 = document.getElementById('length1HeadImgCell');
    const container2 = document.getElementById('length2HeadImgCell');
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    var img1 = document.getElementById('length1HeadImg');
    var img2 = document.getElementById('length2HeadImg');

    //clear canvas
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    //size canvases to character parent cell
    canvas1.width = container1.clientWidth;
    canvas1.height = (parseFloat(img1.height) / parseFloat(img1.width)) * parseFloat(canvas1.width);
    canvas2.width = container2.clientWidth;
    canvas2.height = (parseFloat(img2.height) / parseFloat(img2.width)) * parseFloat(canvas2.width);

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
    cropTop = 0;
    cropRight = 0;
    cropBottom = 0;
    cropLeft = 0;

    ctx1.drawImage(
        img1,                                                 //image to draw
        img1.width * cropLeft,                                //x to start grab
        img1.height * cropTop,                                // y to start grab
        img1.width - (img1.width * (cropLeft + cropRight)),   //x distance to grab
        img1.height - (img1.height * (cropTop + cropBottom)), //y distance to grab
        0, 0,                                                 //where to place image
        canvas1.width, canvas1.height                         //size to scale placed image
    );

    ctx2.drawImage(
        img2,                                                 //image to draw
        img2.width * cropLeft,                                //x to start grab
        img2.height * cropTop,                                // y to start grab
        img2.width - (img2.width * (cropLeft + cropRight)),   //x distance to grab
        img2.height - (img2.height * (cropTop + cropBottom)), //y distance to grab
        0, 0,                                                 //where to place image
        canvas2.width, canvas2.height                         //size to scale placed image
    );
}

//draw characters to lengthHead canvas elements from base images
function drawLengths(manualZoom = 0){
    const canvas1 = document.getElementById('length1Canvas');
    const canvas2 = document.getElementById('length2Canvas');
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    var img1 = document.getElementById('length1Img');
    var img2 = document.getElementById('length2Img');

    //clear canvas
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    //size canvases to character length
    scaleLengthCanvases(manualZoom);

    //custom character crop values
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;
    var flipImage;
    var rotation;

    //draw character 1
    if (char1.id == 'custom1' && document.getElementById('customLengthImageURL1').value != ''){
        cropTop = parseFloat(document.getElementById('cropLengthImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL1').value)/100;
        flipImage = document.getElementById('flipLength1').checked;
        rotation = parseFloat(document.getElementById('rotateLength1').value);
    }
    else if (char1.id == 'custom2' && document.getElementById('customLengthImageURL2').value != ''){
        cropTop = parseFloat(document.getElementById('cropLengthImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL2').value)/100;
        flipImage = document.getElementById('flipLength2').checked;
        rotation = parseFloat(document.getElementById('rotateLength2').value);
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
        flipImage = false;
        rotation = 0;
    }
    
    imageToCanvas(img1, canvas1, cropTop, cropRight, cropBottom, cropLeft, flipImage, rotation, false);

    // ctx1.drawImage(
    //     img1,                                                 //image to draw
    //     img1.width * cropLeft,                                //x to start grab
    //     img1.height * cropTop,                                // y to start grab
    //     img1.width - (img1.width * (cropLeft + cropRight)),   //x distance to grab
    //     img1.height - (img1.height * (cropTop + cropBottom)), //y distance to grab
    //     0, 0,                                                 //where to place image
    //     canvas1.width, canvas1.height                         //size to scale placed image
    // );

    //draw character 2
    if (char2.id == 'custom1' && document.getElementById('customLengthImageURL1').value != ''){
        cropTop = parseFloat(document.getElementById('cropLengthImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL1').value)/100;
        flipImage = document.getElementById('flipLength1').checked;
    }
    else if (char2.id == 'custom2' && document.getElementById('customLengthImageURL2').value != ''){
        cropTop = parseFloat(document.getElementById('cropLengthImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL2').value)/100;
        flipImage = document.getElementById('flipLength2').checked;
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
        flipImage = false;
        rotation = 0;
    }

    imageToCanvas(img2, canvas2, cropTop, cropRight, cropBottom, cropLeft, flipImage, 0, false);

    // ctx2.drawImage(
    //     img2,                                                 //image to draw
    //     img2.width * cropLeft,                                //x to start grab
    //     img2.height * cropTop,                                // y to start grab
    //     img2.width - (img2.width * (cropLeft + cropRight)),   //x distance to grab
    //     img2.height - (img2.height * (cropTop + cropBottom)), //y distance to grab
    //     0, 0,                                                 //where to place image
    //     canvas2.width, canvas2.height                         //size to scale placed image
    // );
}

//adjust length canvas sizes based on character sizes
function scaleLengthCanvases(manualZoom = 0){
    var char1Length = char1.length * char1.length_correction;
    var char2Length = char2.length * char2.length_correction;
    const canvas1 = document.getElementById('length1Canvas');
    const canvas2 = document.getElementById('length2Canvas');
    var img1 = document.getElementById('length1Img');
    var img2 = document.getElementById('length2Img');
    var maxSize;
    var zoom;

    //update images if using custom
    // if(char1.id == 'custom1' && document.getElementById('customLengthImageURL1').value != ''){img1 = customImage1;}
    // else if(char1.id == 'custom2' && document.getElementById('customLengthImageURL2').value != ''){img1 = customImage2;}
    // else if(char2.id == 'custom1' && document.getElementById('customLengthImageURL1').value != ''){img2 = customImage1;}
    // else if(char2.id == 'custom2' && document.getElementById('customLengthImageURL2').value != ''){img2 = customImage1;}

    //find larger characters length
    if (char1Length > char2Length){maxSize = char1Length;}
    else{maxSize = char2Length;}

    //calculate zoom based off of bigger character length
    if (manualZoom != 0) {zoom = manualZoom}
    else if (maxSize >= 300){zoom = 1;}
    else if (maxSize >= 100){zoom = 4;}
    else if (maxSize >= 40){zoom = 12;}
    else if (maxSize >= 20){zoom = 25;}
    else if (maxSize >= 10){zoom = 40;}
    else{zoom = 50;}

    //adjust canvas length based on character length and zoom
    document.getElementById('lengthZoomRange').value = zoom;
    canvas1.width = (zoom * char1Length);
    canvas2.width = (zoom * char2Length);

    //adjust canvas heights to maintain aspect ratio
    var cropTop;
    var cropRight;
    var cropBottom;
    var cropLeft;

    //canvas 1
    if (char1.id == 'custom1'){
        cropTop = parseFloat(document.getElementById('cropLengthImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL1').value)/100;
    }
    else if (char1.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropLengthImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL2').value)/100;
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }
    
    canvas1.height = (parseFloat(img1.height - (img1.height * (cropTop + cropBottom)))/parseFloat(img1.width - (img1.width * (cropLeft + cropRight)))) * parseFloat(canvas1.width);

     //canvas 1
     if (char2.id == 'custom1'){
        cropTop = parseFloat(document.getElementById('cropLengthImageT1').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR1').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB1').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL1').value)/100;
    }
    else if (char2.id == 'custom2'){
        cropTop = parseFloat(document.getElementById('cropLengthImageT2').value)/100;
        cropRight = parseFloat(document.getElementById('cropLengthImageR2').value)/100;
        cropBottom = parseFloat(document.getElementById('cropLengthImageB2').value)/100;
        cropLeft = parseFloat(document.getElementById('cropLengthImageL2').value)/100;
    }
    else{
        cropTop = 0;
        cropRight = 0;
        cropBottom = 0;
        cropLeft = 0;
    }
    
    canvas2.height = (parseFloat(img2.height - (img2.height * (cropTop + cropBottom)))/parseFloat(img2.width - (img2.width * (cropLeft + cropRight)))) * parseFloat(canvas2.width);
}

function adjustLengthZoom(){
    var char1 = getChar(document.getElementById('char1select').value, false);
    var char2 = getChar(document.getElementById('char2select').value, false);
    var char1Length = 0;
    var char2Length = 0;

    // try{
    //     char1Length = char1.length * char1.length_correction;
    // }catch{

    // }
    // try{
    //     char2Length = char2.length * char2.length_correction;
    // }catch{

    // }
    var length1img = document.getElementById('length1Img');
    var length2img = document.getElementById('length2Img');
    var sizeScalar;

    sizeScalar = document.getElementById('lengthZoomRange').value;
    length1img.style.length = (sizeScalar * char1Length) + 'px';
    length2img.style.length = (sizeScalar * char2Length) + 'px';

    drawLengths(sizeScalar);

    console.log('Scaled by: ' + sizeScalar);
}

function updateLengthBG(){
    const bgColor = document.getElementById('lengthBGColor').value;
    const bg1 = document.getElementById('length1ImgCell');
    const bgh1 = document.getElementById('length1HeadImgCell');
    const bg2 = document.getElementById('length2ImgCell');
    const bgh2 = document.getElementById('length2HeadImgCell');

    bg1.style.backgroundColor = bgColor;
    //bgh1.style.backgroundColor = bgColor;

    bg2.style.backgroundColor = bgColor;
    //bgh2.style.backgroundColor = bgColor;
}

//-------- Profile Tab Stuff -----------------


//-------- Custom Tab Stuff -----------------
var h1PreviewShapes = [];
var h2PreviewShapes = [];
var l1PreviewShapes = [];
var l2PreviewShapes = [];
var clickedShapeIndex = 0;
var startX = 0;
var startY = 0;
var isDragging = false;

function openCustomTab(customTab){
    document.getElementById('custom1').style.display = 'none';
    document.getElementById('custom2').style.display = 'none';

    document.getElementById('custom1Button').style.color = '#000';
    document.getElementById('custom2Button').style.color = '#000';

    document.getElementById('custom' + customTab).style.display = 'block';
    document.getElementById('custom' + customTab + 'Button').style.color = 'blue';
}

function openCustomSubTab(tab, subTab){
    document.getElementById('customHeightTab' + tab).style.display = 'none';
    document.getElementById('customLengthTab' + tab).style.display = 'none';

    document.getElementById('customHeightButton' + tab).style.color = '#000';
    document.getElementById('customLengthButton' + tab).style.color = '#000';

    document.getElementById('custom' + subTab + 'Tab' + tab).style.display = 'flex';
    document.getElementById('custom' + subTab + 'Button' + tab).style.color = 'blue';
}

function adjustCrop(cropChar, cropImage, cropDimension){
    const topCropInput = document.getElementById('crop' + cropImage + 'ImageT' + cropChar);
    const rightCropInput = document.getElementById('crop' + cropImage + 'ImageR' + cropChar);
    const bottomCropInput = document.getElementById('crop' + cropImage + 'ImageB' + cropChar);
    const leftCropInput = document.getElementById('crop' + cropImage + 'ImageL' + cropChar);
    const canvas = document.getElementById('custom' + cropImage + 'PreviewCanvas' + cropChar);

    //check for overflow and adjust
    if(cropDimension == "T" && (parseFloat(topCropInput.value) + parseFloat(bottomCropInput.value) >= 100)){
        bottomCropInput.value = 99 - parseFloat(topCropInput.value);
    }
    else if(cropDimension == "R" && (parseFloat(rightCropInput.value) + parseFloat(leftCropInput.value) >= 100)){
        leftCropInput.value = 99 - parseFloat(rightCropInput.value);
    }
    else if(cropDimension == "B" && (parseFloat(topCropInput.value) + parseFloat(bottomCropInput.value) >= 100)){
        topCropInput.value = 99 - parseFloat(bottomCropInput.value);
    }
    else if(cropDimension == "L" && (parseFloat(rightCropInput.value) + parseFloat(leftCropInput.value) >= 100)){
        rightCropInput.value = 99 - parseFloat(leftCropInput.value);
    }

    //update control shapes if triggered from input boxes
    if (cropChar == 1 && cropImage == 'Height'){h1PreviewShapes = updateShapes(h1PreviewShapes, parseInt(topCropInput.value), parseInt(rightCropInput.value), parseInt(bottomCropInput.value), parseInt(leftCropInput.value), canvas);}
    else if (cropChar == 2 && cropImage == 'Height'){h2PreviewShapes = updateShapes(h2PreviewShapes, parseInt(topCropInput.value), parseInt(rightCropInput.value), parseInt(bottomCropInput.value), parseInt(leftCropInput.value), canvas);}
    else if (cropChar == 1 && cropImage == 'Length'){l1PreviewShapes = updateShapes(l1PreviewShapes, parseInt(topCropInput.value), parseInt(rightCropInput.value), parseInt(bottomCropInput.value), parseInt(leftCropInput.value), canvas);}
    else if (cropChar == 2 && cropImage == 'Length'){l2PreviewShapes = updateShapes(l2PreviewShapes, parseInt(topCropInput.value), parseInt(rightCropInput.value), parseInt(bottomCropInput.value), parseInt(leftCropInput.value), canvas);}

    //update appropriate preview image
    if(cropImage == 'Height'){updateHeightPreviewCanvas(cropChar);}
    else if(cropImage == 'Length'){updateLengthPreviewCanvas(cropChar);}
}

function updateHeightPreviewCanvas(targetCanv, resetControls = false){
    const canvas = document.getElementById('customHeightPreviewCanvas' + targetCanv);
    const ctx = canvas.getContext('2d');
    const customLink = document.getElementById('customHeightImageURL' + targetCanv).value;
    const container = document.getElementById('customCanvasContainerH' + targetCanv);

    //reset controls if new image
    if(resetControls){
        //reset crop fields
        document.getElementById('cropHeightImageT' + targetCanv).value = 0;
        document.getElementById('cropHeightImageR' + targetCanv).value = 0;
        document.getElementById('cropHeightImageB' + targetCanv).value = 0;
        document.getElementById('cropHeightImageL' + targetCanv).value = 0;

        //reset background filtering
        document.getElementById('removeBGColorCheck'  + targetCanv).checked = false;
        document.getElementById('removeTolerance'  + targetCanv).value = 10;
    }

    var cropTop = parseFloat(document.getElementById('cropHeightImageT' + targetCanv).value)/100;
    var cropRight = parseFloat(document.getElementById('cropHeightImageR' + targetCanv).value)/100;
    var cropBottom = parseFloat(document.getElementById('cropHeightImageB' + targetCanv).value)/100;
    var cropLeft = parseFloat(document.getElementById('cropHeightImageL' + targetCanv).value)/100;

    //drawing image to preview canvas
    var img = new Image();
    img.onload = function () {
        // resize preview canvas based on image dimensions.  
        // Determine its biggest dimension, then scale the canvas to it inside the div
        if(img.width > img.height){
            canvas.width = container.clientWidth;
            canvas.height = (parseFloat(img.height) / parseFloat(img.width)) * parseFloat(canvas.width);
        }
        else{
            canvas.height = container.clientHeight;
            canvas.width = (parseFloat(img.width) / parseFloat(img.height)) * parseFloat(canvas.height);
        }
        //check for overflow
        while(canvas.height > container.clientHeight || canvas.width > container.clientWidth){
            canvas.width *= 0.99;
            canvas.height *= 0.99;
        }

        //enable image controls
        document.getElementById('cropHeightImageT' + targetCanv).disabled = false;
        document.getElementById('cropHeightImageR' + targetCanv).disabled = false;
        document.getElementById('cropHeightImageB' + targetCanv).disabled = false;
        document.getElementById('cropHeightImageL' + targetCanv).disabled = false;
        document.getElementById('customHeightCorrect' + targetCanv).disabled = false;
        document.getElementById('removeBGColorCheck' + targetCanv).disabled = false;
        document.getElementById('removeBGColor' + targetCanv).disabled = false;
        document.getElementById('removeTolerance' + targetCanv).disabled = false;

        //if this is a new image, create control shapes
        if(targetCanv == 1 && h1PreviewShapes.length == 0){h1PreviewShapes = createControlShapes(canvas);}
        else if(targetCanv == 2 && h2PreviewShapes.length == 0){h2PreviewShapes = createControlShapes(canvas);}

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

        //draw control shapes
        if(targetCanv == 1){drawShapesToCanvas(h1PreviewShapes, canvas);}
        else{drawShapesToCanvas(h2PreviewShapes, canvas);}
    };
    
    //handle bad image links
    img.onerror = function () {
        //reset canvas size
        canvas.width = container.clientWidth * 0.95;
        canvas.height = container.clientHeight * 0.95;
        
        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //tell user it was a bad url
        ctx.font = Math.round(0.04 * canvas.height) + "px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Bad Image URL", canvas.width/2, canvas.height/2);

        //remove control shapes
        if(targetCanv ==1){h1PreviewShapes = [];}
        else{h2PreviewShapes = [];}

        //blank url
        document.getElementById('customHeightImageURL' + targetCanv).value = '';

        //reset image controls
        document.getElementById('cropHeightImageT' + targetCanv).value = 0;
        document.getElementById('cropHeightImageR' + targetCanv).value = 0;
        document.getElementById('cropHeightImageB' + targetCanv).value = 0;
        document.getElementById('cropHeightImageL' + targetCanv).value = 0;
        document.getElementById('customHeightCorrect' + targetCanv).value = 100;
        document.getElementById('removeBGColorCheck'  + targetCanv).checked = false;
        document.getElementById('removeTolerance'  + targetCanv).value = 10;

        //disable image controls
        document.getElementById('cropHeightImageT' + targetCanv).disabled = true;
        document.getElementById('cropHeightImageR' + targetCanv).disabled = true;
        document.getElementById('cropHeightImageB' + targetCanv).disabled = true;
        document.getElementById('cropHeightImageL' + targetCanv).disabled = true;
        document.getElementById('customHeightCorrect' + targetCanv).disabled = true;
        document.getElementById('removeBGColorCheck' + targetCanv).disabled = true;
        document.getElementById('removeBGColor' + targetCanv).disabled = true;
        document.getElementById('removeTolerance' + targetCanv).disabled = true;
    }

    img.src = customLink;

}

function updateLengthPreviewCanvas(targetCanv, resetControls = false){
    const canvas = document.getElementById('customLengthPreviewCanvas' + targetCanv);
    const ctx = canvas.getContext('2d');
    const customLink = document.getElementById('customLengthImageURL' + targetCanv).value;
    const container = document.getElementById('customCanvasContainerL' + targetCanv);

    //reset controls if new image
    if(resetControls){
        //reset crop fields
        document.getElementById('cropLengthImageT' + targetCanv).value = 0;
        document.getElementById('cropLengthImageR' + targetCanv).value = 0;
        document.getElementById('cropLengthImageB' + targetCanv).value = 0;
        document.getElementById('cropLengthImageL' + targetCanv).value = 0;

        //reset background filtering
        // document.getElementById('removeBGColorCheck'  + targetCanv).checked = false;
        // document.getElementById('removeTolerance'  + targetCanv).value = 10;
    }

    var cropTop = parseFloat(document.getElementById('cropLengthImageT' + targetCanv).value)/100;
    var cropRight = parseFloat(document.getElementById('cropLengthImageR' + targetCanv).value)/100;
    var cropBottom = parseFloat(document.getElementById('cropLengthImageB' + targetCanv).value)/100;
    var cropLeft = parseFloat(document.getElementById('cropLengthImageL' + targetCanv).value)/100;

    //drawing image to preview canvas
    var img = new Image();
    img.onload = function () {
        // resize preview canvas based on image dimensions.  
        // Determine its biggest dimension, then scale the canvas to it inside the div
        if(img.width > img.height){
            canvas.width = container.clientWidth;
            canvas.height = (parseFloat(img.height) / parseFloat(img.width)) * parseFloat(canvas.width);
        }
        else{
            canvas.height = container.clientHeight;
            canvas.width = (parseFloat(img.width) / parseFloat(img.height)) * parseFloat(canvas.height);
        }
        //check for overflow
        while(canvas.height > container.clientHeight || canvas.width > container.clientWidth){
            canvas.width *= 0.99;
            canvas.height *= 0.99;
        }

        //enable image controls
        document.getElementById('cropLengthImageT' + targetCanv).disabled = false;
        document.getElementById('cropLengthImageR' + targetCanv).disabled = false;
        document.getElementById('cropLengthImageB' + targetCanv).disabled = false;
        document.getElementById('cropLengthImageL' + targetCanv).disabled = false;
        document.getElementById('customLengthCorrect' + targetCanv).disabled = false;
        document.getElementById('flipLength' + targetCanv).disabled = false;
        document.getElementById('rotateLength' + targetCanv).disabled = false;
        // document.getElementById('removeBGColorCheck' + targetCanv).disabled = false;
        // document.getElementById('removeBGColor' + targetCanv).disabled = false;
        // document.getElementById('removeTolerance' + targetCanv).disabled = false;

        //if this is a new image, create control shapes
        if(targetCanv == 1 && l1PreviewShapes.length == 0){l1PreviewShapes = createControlShapes(canvas);}
        else if(targetCanv == 2 && l2PreviewShapes.length == 0){l2PreviewShapes = createControlShapes(canvas);}

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

        //draw control shapes
        if(targetCanv == 1){drawShapesToCanvas(l1PreviewShapes, canvas);}
        else{drawShapesToCanvas(l2PreviewShapes, canvas);}
    };
    
    //handle bad image links
    img.onerror = function () {
        //reset canvas size
        canvas.width = container.clientWidth * 0.95;
        canvas.height = container.clientHeight * 0.95;
        
        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //tell user it was a bad url
        ctx.font = Math.round(0.04 * canvas.height) + "px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Bad Image URL", canvas.width/2, canvas.height/2);

        //remove control shapes
        if(targetCanv ==1){l1PreviewShapes = [];}
        else{l2PreviewShapes = [];}

        //blank url
        document.getElementById('customLengthImageURL' + targetCanv).value = '';

        //reset image controls
        document.getElementById('cropLengthImageT' + targetCanv).value = 0;
        document.getElementById('cropLengthImageR' + targetCanv).value = 0;
        document.getElementById('cropLengthImageB' + targetCanv).value = 0;
        document.getElementById('cropLengthImageL' + targetCanv).value = 0;
        document.getElementById('customLengthCorrect' + targetCanv).value = 100;
        document.getElementById('flipLength' + targetCanv).checked = false;
        document.getElementById('rotateLength' + targetCanv).value = 0;
        //document.getElementById('removeBGColorCheck'  + targetCanv).checked = false;
        //document.getElementById('removeTolerance'  + targetCanv).value = 10;

        //disable image controls
        document.getElementById('cropLengthImageT' + targetCanv).disabled = true;
        document.getElementById('cropLengthImageR' + targetCanv).disabled = true;
        document.getElementById('cropLengthImageB' + targetCanv).disabled = true;
        document.getElementById('cropLengthImageL' + targetCanv).disabled = true;
        document.getElementById('customLengthCorrect' + targetCanv).disabled = true;
        document.getElementById('flipLength' + targetCanv).disabled = true;
        document.getElementById('rotateLength' + targetCanv).disabled = true;
        //document.getElementById('removeBGColorCheck' + targetCanv).disabled = true;
        //document.getElementById('removeBGColor' + targetCanv).disabled = true;
        //document.getElementById('removeTolerance' + targetCanv).disabled = true;
    }

    img.src = customLink;

}

function createControlShapes(canvas){
    const shapes = [];
    const shapeSize = Math.max(canvas.width, canvas.height) * 0.04;
    
    shapes.push({name: 'top', x: (canvas.width / 2) - (shapeSize/2), y: 0 - (shapeSize/2), height: shapeSize, width: shapeSize, color: 'red'}); //Top
    shapes.push({name: 'right', x: canvas.width - (shapeSize/2), y: (canvas.height / 2) - (shapeSize/2), height: shapeSize, width: shapeSize, color: 'red'});//Right
    shapes.push({name: 'bottom', x: (canvas.width / 2) - (shapeSize/2), y: canvas.height - (shapeSize/2), height: shapeSize, width: shapeSize, color: 'red'});//Bottom
    shapes.push({name: 'left', x: 0 - (shapeSize/2), y: (canvas.height / 2) - (shapeSize/2), height: shapeSize, width: shapeSize, color: 'red'});//Left

    return shapes
}

function updateShapes(shapes, top, right, bottom, left, canvas){
    const shapeSize = Math.max(canvas.width, canvas.height) * 0.04;

    top /= 100;
    right /= 100;
    bottom /= 100;
    left /= 100;

    for(let shape of shapes){
        shape.height = shapeSize;
        shape.width = shapeSize;
        if(shape.name == 'top'){
            shape.x = ((((1 - (right + left)) / 2) + left) * canvas.width) - (shape.width/2);
            shape.y = (top * canvas.height) - (shape.height/2);
        }
        else if(shape.name == 'right'){
            shape.x = ((1 - right) * canvas.width) - (shape.width/2);
            shape.y = ((((1 - (top + bottom)) / 2) + top) * canvas.height) - (shape.height/2);
        }
        else if(shape.name == 'bottom'){
            shape.x = ((((1 - (right + left)) / 2) + left) * canvas.width) - (shape.width/2);
            shape.y = ((1 - bottom) * canvas.height) - (shape.height/2);
        }
        else if(shape.name == 'left'){
            shape.x = (left * canvas.width) - (shape.width/2);
            shape.y = ((((1 - (top + bottom)) / 2) + top) * canvas.height) - (shape.height/2);
        }
    }

    return shapes
}

function drawShapesToCanvas(shapes, canvas){
    if(!isDragging)
        {
        ctx = canvas.getContext("2d");
        
        for(let shape of shapes){
            ctx.fillStyle = shape.color;
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

let mouseDownPreviewCanvas = function(event){
    event.preventDefault();
    var shapes;

    if(this.id == 'customHeightPreviewCanvas1'){shapes = h1PreviewShapes;}
    else if(this.id == 'customHeightPreviewCanvas2'){shapes = h2PreviewShapes;}
    else if(this.id == 'customLengthPreviewCanvas1'){shapes = l1PreviewShapes;}
    else if(this.id == 'customLengthPreviewCanvas2'){shapes = l2PreviewShapes;}

    const rect = this.getBoundingClientRect();
    startX = parseInt(event.clientX) - rect.left;
    startY = parseInt(event.clientY) - rect.top;

    let index = 0;
    for (let shape of shapes){
        if (isMouseInShape(startX, startY, shape)){
            clickedShapeIndex = index;
            isDragging = true;
        }
        index++;
    }
}

let mouseUpPreviewCanvas = function(event){
    if(!isDragging){
        return;
    }

    //disable dragging trigger
    event.preventDefault();
    isDragging = false;

    //update controlshapes for each preview canvas by just triggering the input box function
    if(this.id == 'customHeightPreviewCanvas1' && document.getElementById('customHeightImageURL1').value != ''){adjustCrop(1, 'Height', 'T');}
    else if(this.id == 'customHeightPreviewCanvas2' && document.getElementById('customHeightImageURL2').value != ''){adjustCrop(2, 'Height', 'T');}
    else if(this.id == 'customLengthPreviewCanvas1' && document.getElementById('customLengthImageURL1').value != ''){adjustCrop(1, 'Length', 'T');}
    else if(this.id == 'customLengthPreviewCanvas2' && document.getElementById('customLengthImageURL2').value != ''){adjustCrop(2, 'Length', 'T');}
}

let mouseMovePreviewCanvas = function(event){
    if(!isDragging){
        return;
    }
    else {
        event.preventDefault();

        const rect = this.getBoundingClientRect();
        let mouseX = parseInt(event.clientX) - rect.left;
        let mouseY = parseInt(event.clientY) - rect.top;

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        //get appropriate shapes, and allow them to move only on their particular axis, update the input boxes, then update canvas
        if(this.id == 'customHeightPreviewCanvas1'){
            //update appropriate shape with mouse delta, and its corresponding input box
            if(h1PreviewShapes[clickedShapeIndex].name == 'right'){
                h1PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(h1PreviewShapes[clickedShapeIndex].x + dx), 0 - (h1PreviewShapes[clickedShapeIndex].width / 2)), this.width - (h1PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropHeightImageR1').value = parseInt((1 - ((h1PreviewShapes[clickedShapeIndex].x + (h1PreviewShapes[clickedShapeIndex].width / 2)) / this.width)) * 100);
            
            }
            else if(h1PreviewShapes[clickedShapeIndex].name == 'left'){
                h1PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(h1PreviewShapes[clickedShapeIndex].x + dx), 0 - (h1PreviewShapes[clickedShapeIndex].width / 2)), this.width - (h1PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropHeightImageL1').value = parseInt(((h1PreviewShapes[clickedShapeIndex].x + (h1PreviewShapes[clickedShapeIndex].width / 2)) / this.width) * 100);
            }
            else if(h1PreviewShapes[clickedShapeIndex].name == 'top'){
                h1PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(h1PreviewShapes[clickedShapeIndex].y + dy), 0 - (h1PreviewShapes[clickedShapeIndex].height / 2)), this.height - (h1PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropHeightImageT1').value = parseInt(((h1PreviewShapes[clickedShapeIndex].y + (h1PreviewShapes[clickedShapeIndex].height / 2)) / this.height) * 100);
            }
            else if(h1PreviewShapes[clickedShapeIndex].name == 'bottom'){
                h1PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(h1PreviewShapes[clickedShapeIndex].y + dy), 0 - (h1PreviewShapes[clickedShapeIndex].height / 2)), this.height - (h1PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropHeightImageB1').value = parseInt((1 - ((h1PreviewShapes[clickedShapeIndex].y + (h1PreviewShapes[clickedShapeIndex].height / 2)) / this.height)) * 100);
            }

            updateHeightPreviewCanvas(1);
        }
        else if(this.id == 'customHeightPreviewCanvas2'){
            if(h2PreviewShapes[clickedShapeIndex].name == 'right'){
                h2PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(h2PreviewShapes[clickedShapeIndex].x + dx), 0 - (h2PreviewShapes[clickedShapeIndex].width / 2)), this.width - (h2PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropHeightImageR2').value = parseInt((1 - ((h2PreviewShapes[clickedShapeIndex].x + (h2PreviewShapes[clickedShapeIndex].width / 2)) / this.width)) * 100);
            }
            else if(h2PreviewShapes[clickedShapeIndex].name == 'left'){
                h2PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(h2PreviewShapes[clickedShapeIndex].x + dx), 0 - (h2PreviewShapes[clickedShapeIndex].width / 2)), this.width - (h2PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropHeightImageL2').value = parseInt(((h2PreviewShapes[clickedShapeIndex].x + (h2PreviewShapes[clickedShapeIndex].width / 2)) / this.width) * 100);
            }
            else if(h2PreviewShapes[clickedShapeIndex].name == 'top'){
                h2PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(h2PreviewShapes[clickedShapeIndex].y + dy), 0 - (h2PreviewShapes[clickedShapeIndex].height / 2)), this.height - (h2PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropHeightImageT2').value = parseInt(((h2PreviewShapes[clickedShapeIndex].y + (h2PreviewShapes[clickedShapeIndex].height / 2)) / this.height) * 100);
            }
            else if(h2PreviewShapes[clickedShapeIndex].name == 'bottom'){
                h2PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(h2PreviewShapes[clickedShapeIndex].y + dy), 0 - (h2PreviewShapes[clickedShapeIndex].height / 2)), this.height - (h2PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropHeightImageB2').value = parseInt((1 - ((h2PreviewShapes[clickedShapeIndex].y + (h2PreviewShapes[clickedShapeIndex].height / 2)) / this.height)) * 100);
            }
            updateHeightPreviewCanvas(2);
        }
        else if(this.id == 'customLengthPreviewCanvas1'){
            //update appropriate shape with mouse delta, and its corresponding input box
            if(l1PreviewShapes[clickedShapeIndex].name == 'right'){
                l1PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(l1PreviewShapes[clickedShapeIndex].x + dx), 0 - (l1PreviewShapes[clickedShapeIndex].width / 2)), this.width - (l1PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropLengthImageR1').value = parseInt((1 - ((l1PreviewShapes[clickedShapeIndex].x + (l1PreviewShapes[clickedShapeIndex].width / 2)) / this.width)) * 100);
            
            }
            else if(l1PreviewShapes[clickedShapeIndex].name == 'left'){
                l1PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(l1PreviewShapes[clickedShapeIndex].x + dx), 0 - (l1PreviewShapes[clickedShapeIndex].width / 2)), this.width - (l1PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropLengthImageL1').value = parseInt(((l1PreviewShapes[clickedShapeIndex].x + (l1PreviewShapes[clickedShapeIndex].width / 2)) / this.width) * 100);
            }
            else if(l1PreviewShapes[clickedShapeIndex].name == 'top'){
                l1PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(l1PreviewShapes[clickedShapeIndex].y + dy), 0 - (l1PreviewShapes[clickedShapeIndex].height / 2)), this.height - (l1PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropLengthImageT1').value = parseInt(((l1PreviewShapes[clickedShapeIndex].y + (l1PreviewShapes[clickedShapeIndex].height / 2)) / this.height) * 100);
            }
            else if(l1PreviewShapes[clickedShapeIndex].name == 'bottom'){
                l1PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(l1PreviewShapes[clickedShapeIndex].y + dy), 0 - (l1PreviewShapes[clickedShapeIndex].height / 2)), this.height - (l1PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropLengthImageB1').value = parseInt((1 - ((l1PreviewShapes[clickedShapeIndex].y + (l1PreviewShapes[clickedShapeIndex].height / 2)) / this.height)) * 100);
            }

            updateLengthPreviewCanvas(1);
        }
        else if(this.id == 'customLengthPreviewCanvas2'){
            if(l2PreviewShapes[clickedShapeIndex].name == 'right'){
                l2PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(l2PreviewShapes[clickedShapeIndex].x + dx), 0 - (l2PreviewShapes[clickedShapeIndex].width / 2)), this.width - (l2PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropLengthImageR2').value = parseInt((1 - ((l2PreviewShapes[clickedShapeIndex].x + (l2PreviewShapes[clickedShapeIndex].width / 2)) / this.width)) * 100);
            }
            else if(l2PreviewShapes[clickedShapeIndex].name == 'left'){
                l2PreviewShapes[clickedShapeIndex].x = Math.min(Math.max(parseInt(l2PreviewShapes[clickedShapeIndex].x + dx), 0 - (l2PreviewShapes[clickedShapeIndex].width / 2)), this.width - (l2PreviewShapes[clickedShapeIndex].width / 2));
                document.getElementById('cropLengthImageL2').value = parseInt(((l2PreviewShapes[clickedShapeIndex].x + (l2PreviewShapes[clickedShapeIndex].width / 2)) / this.width) * 100);
            }
            else if(l2PreviewShapes[clickedShapeIndex].name == 'top'){
                l2PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(l2PreviewShapes[clickedShapeIndex].y + dy), 0 - (l2PreviewShapes[clickedShapeIndex].height / 2)), this.height - (l2PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropLengthImageT2').value = parseInt(((l2PreviewShapes[clickedShapeIndex].y + (l2PreviewShapes[clickedShapeIndex].height / 2)) / this.height) * 100);
            }
            else if(l2PreviewShapes[clickedShapeIndex].name == 'bottom'){
                l2PreviewShapes[clickedShapeIndex].y = Math.min(Math.max(parseInt(l2PreviewShapes[clickedShapeIndex].y + dy), 0 - (l2PreviewShapes[clickedShapeIndex].height / 2)), this.height - (l2PreviewShapes[clickedShapeIndex].height / 2));
                document.getElementById('cropLengthImageB2').value = parseInt((1 - ((l2PreviewShapes[clickedShapeIndex].y + (l2PreviewShapes[clickedShapeIndex].height / 2)) / this.height)) * 100);
            }
            updateLengthPreviewCanvas(2);
        }

        //update new mouse position
        startX = mouseX;
        startY = mouseY;
    }
}

function isMouseInShape(x, y, shape){
    let shapeLeft = shape.x;
    let shapeRight = shape.x + shape.width;
    let shapeTop = shape.y;
    let shapeBottom = shape.y + shape.height;

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom){
        return true;
    }
    
    return false;
}

// ---- Add Event Listeners ------------

document.getElementById('customHeightPreviewCanvas1').onmousedown = mouseDownPreviewCanvas;
document.getElementById('customHeightPreviewCanvas1').addEventListener('touchstart', function(event) {mouseDownPreviewCanvas;});
document.getElementById('customHeightPreviewCanvas1').onmouseup = mouseUpPreviewCanvas;
document.getElementById('customHeightPreviewCanvas1').addEventListener('touchend', function(event) {mouseUpPreviewCanvas;});
document.getElementById('customHeightPreviewCanvas1').onmouseout = mouseUpPreviewCanvas;
document.getElementById('customHeightPreviewCanvas1').onmousemove = mouseMovePreviewCanvas;

document.getElementById('customHeightPreviewCanvas2').onmousedown = mouseDownPreviewCanvas;
document.getElementById('customHeightPreviewCanvas2').addEventListener('touchstart', function(event) {mouseDownPreviewCanvas;});
document.getElementById('customHeightPreviewCanvas2').onmouseup = mouseUpPreviewCanvas;
document.getElementById('customHeightPreviewCanvas2').addEventListener('touchend', function(event) {mouseUpPreviewCanvas;});
document.getElementById('customHeightPreviewCanvas2').onmouseout = mouseUpPreviewCanvas;
document.getElementById('customHeightPreviewCanvas2').onmousemove = mouseMovePreviewCanvas;

document.getElementById('customLengthPreviewCanvas1').onmousedown = mouseDownPreviewCanvas;
document.getElementById('customLengthPreviewCanvas1').addEventListener('touchstart', function(event) {mouseDownPreviewCanvas;});
document.getElementById('customLengthPreviewCanvas1').onmouseup = mouseUpPreviewCanvas;
document.getElementById('customLengthPreviewCanvas1').addEventListener('touchend', function(event) {mouseUpPreviewCanvas;});
document.getElementById('customLengthPreviewCanvas1').onmouseout = mouseUpPreviewCanvas;
document.getElementById('customLengthPreviewCanvas1').onmousemove = mouseMovePreviewCanvas;

document.getElementById('customLengthPreviewCanvas2').onmousedown = mouseDownPreviewCanvas;
document.getElementById('customLengthPreviewCanvas2').addEventListener('touchstart', function(event) {mouseDownPreviewCanvas;});
document.getElementById('customLengthPreviewCanvas2').onmouseup = mouseUpPreviewCanvas;
document.getElementById('customLengthPreviewCanvas2').addEventListener('touchend', function(event) {mouseUpPreviewCanvas;});
document.getElementById('customLengthPreviewCanvas2').onmouseout = mouseUpPreviewCanvas;
document.getElementById('customLengthPreviewCanvas2').onmousemove = mouseMovePreviewCanvas;

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

function downloadCanvas(canvas){  
    // get canvas data  
    var image = canvas.toDataURL();  
  
    // create temporary link  
    var tmpLink = document.createElement( 'a' );  
    tmpLink.download = 'image.png'; // set the name of the download file 
    tmpLink.href = image;  
  
    // temporarily add link to body and initiate the download  
    document.body.appendChild( tmpLink );  
    tmpLink.click();  
    document.body.removeChild( tmpLink );  
}

function copyCanvasToClipboard(canvas){
    const blob = canvasToBlob(canvas);
    const item = new ClipboardItem({ "image/png": blob });
    
    navigator.clipboard.write([item]);
}

function canvasToBlob(canvas){
    const ctx = canvas.getContext("2d");

    return new Promise(resolve => {
        canvas.toBlob((blob) => {
        // here the image is a blob
        resolve(blob)
        }, "image/png", 0.75);
    })
}

function imageToCanvas(img, canvas, cropTop = 0, cropRight = 0, cropBottom = 0, cropLeft = 0, flipImage = false, rotateImage = 0, scaleCanvasToImage = false){
    const ctx = canvas.getContext("2d");

    //clear canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //size canvas to image size
    if(scaleCanvasToImage){
        canvas.height = img.height;
        canvas.width = img.width;
    }

    //draw image to canvas
    ctx.globalCompositeOperation = 'copy';                      //keeps alpha channel

    if(flipImage){
        ctx.scale(-1, 1);                                       //
        ctx.translate(-canvas.width, 0);                        //
    }

    if (rotateImage > 0) {
        const radians = (rotateImage * Math.PI) / 180;          //convert from degrees to radians
        ctx.translate(canvas.width / 2, canvas.height / 2);     //move to middle of canvas
        ctx.rotate(radians);                                    //rotate context
    }

    ctx.drawImage(
        img,                                                    //image to draw
        img.width * cropLeft,                                   //image x to start grab
        img.height * cropTop,                                   //image y to start grab
        img.width - (img.width * (cropLeft + cropRight)),       //image x distance to grab
        img.height - (img.height * (cropTop + cropBottom)),     //image y distance to grab
        0,                                                      //canvas x to place image
        0,                                                      //canvas y to place image
        canvas.width,                                           //image width on canvas
        canvas.height                                           //image heigh on canvas
    );
}

function inchesToText(inches){
    return (Math.floor(inches/12) + "' " + inches % 12 + '"')
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

function prepPoxyElements(){
    var proxyElements = document.getElementsByClassName('proxyElement');
    for (var i = 0; i < proxyElements.length; ++i) {
        proxyElements[i].hidden = true;
    }
}

prepPoxyElements();
loadCharacters();
openTab('height');
openCustomTab(1);
openCustomSubTab(1, 'Height');
openCustomSubTab(2, 'Height');