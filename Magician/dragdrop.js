 //var code;
function doFirst() {
    mypic = document.getElementById('magicianpic');
    mypic.addEventListener("dragstart", stratDrag, false);
    leftbox = document.getElementById('leftbox');
    leftbox.addEventListener("dragenter", dragenter , false);//dragenter something enter here
    leftbox.addEventListener("dragleave", dragleave, false);
    leftbox.addEventListener("dragover", dragover, false);
    leftbox.addEventListener("drop", dropped, false);
}
//Start drag image with even listener
function stratDrag(e) {
    var code = '<img id="magicianpic" src="./img/magician1.png">';//source code for image
    //e.dataTranfer.setData('canvas', code);//store information in this even
     // store a ref. on the dragged elem
      code = e.target;
      // make it half transparent
      e.target.style.opacity = .5;
}

//drag enter function 
function dragenter(e){
    // highlight potential drop target when the draggable element enters it
      if ( e.target.getElementById == "leftbox" ) {
          e.target.style.background = "white";
      }
}
//drag leave funtion
function dragleave(e) {
    // reset background of potential drop target when the draggable element leaves it
      if ( e.target.getElementById == "leftbox" ) {
          e.target.style.background = "";
      }
}

//drag over function 
function dragover(e) {
      // prevent default to allow drop
      e.preventDefault();

}
//drag over function
function dropped(e) {
   e.preventDefault();
   leftbox.innerHTML =  e.dataTransfer.getData('canvas');
   
}
window.addEventListener("load", doFirst, false);