var arr_i = 0;
var text_i = 0;
var texts = ['Computer Scientist', 'Compiler Researcher', 'Computer Engineer'];
var text = texts[0];
var typing = true;
var speed = 50;

function typeWriter() {
  if ( typing ) {
    if ( text_i >= text.length ) {
      typing = false; // start erasing
    }
  } else {
    if ( text_i < 0 ) {
      arr_i = (arr_i+1) % (texts.length);
      text = texts[arr_i];
      typing = true; // start typing next letter
    }
  }
  
  if ( typing ) {
    // type next letter
    ++text_i;
  } else {
    // erase next letter
    --text_i;
  }

  document.getElementById("typewriter-title").innerHTML = text.substr(0, stext_i);
  
  setTimeout(typeWriter, speed);
}
