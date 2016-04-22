function doFirst() {
    mypic = document.getElementById('magicianpic');
    mypic.addEventListener("dragstart", stratDrag, false);
    leftbox = document.getElementById('leftbox');
    leftbox.addEventListener("dragenter", function(e){e.preventDefault();} , false);//dragenter something enter here
    leftbox.addEventListener("dragover", function(e){e.preventDefault();}, false);
    leftbox.addEventListener("drop", dropped, false);
}
//Start drag image with even listener
function stratDrag(e) {
    var code = '<img id="magicianpic" src="./img/magician1.png">';//source code for image
    e.dataTranfer.setData('canvas', code);//store information in this even
}

//drag over function
function dropped(e) {
    e.preventDefault();
    leftbox.innerHTML =  e.dataTransfer.getData('canvas');
}
window.addEventListener("load", doFirst, false);