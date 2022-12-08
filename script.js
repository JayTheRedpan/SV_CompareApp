//var siteurl = "https://jaytheredpan.github.io/SV_CompareApp/";
var siteurl = "./";

function updateImg1(){
    document.getElementById('char1img').src = siteurl + "Images/" + document.getElementById('char1select').value;
}

function updateImg2(){
    document.getElementById('char2img').src = siteurl + "Images/" + document.getElementById('char2select').value;
}
