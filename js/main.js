var arr_i = 0;
var text_i = 0;
var texts = ['Computer Scientist', 'Compiler Researcher', 'Computer Engineer'];
var text = texts[0];
var typing = true;
var holding = false;
var cursor_status = true;
var speed = 250;
var hold_time = 3500;
var time_held = 0;

function typeWriter() {
  if ( holding ) {
    if ( time_held < hold_time ) {
      time_held += speed;
    } else {
      time_held = 0;
      holding = false;
    }
  } else {
    if ( typing ) {
      if ( text_i >= text.length ) {
        typing = false; // start erasing
        
        holding = true;
        time_held = 0;
      }
    } else {
      if ( text_i < 0 ) {
        arr_i = (arr_i+1) % (texts.length);
        text = texts[arr_i];
        typing = true; // start typing next letter
        
        holding = true;
        time_held = 0;
      }
    }
    
    if ( typing ) {
      // type next letter
      ++text_i;
    } else {
      // erase next letter
      --text_i;
    }

    document.getElementById("typewriter-title").innerHTML = text.substr(0, text_i);
  }

  if ( cursor_status ) {
    document.getElementById("typewriter-title").style.borderRightStyle = "solid";
    cursor_status = false;
  } else {
    document.getElementById("typewriter-title").style.borderRightStyle = "none";
    cursor_status = true;
  }
  
  setTimeout(typeWriter, speed);
}
