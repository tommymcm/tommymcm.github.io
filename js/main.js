var arr_i = 0;
var text_i = 0;
var texts = ['Computer Scientist', 'Compiler Researcher', 'Computer Engineer'];
var text = texts[0];
var typing = true;
var holding = false;
var cursor_status = true;
var cursor_time = 400;
var cursor_held = 0;
var speed = 200;
var hold_speed = (speed / 4);
var hold_time = 1000;
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

    if ( !holding ) {
      if ( typing ) {
        // type next letter
        ++text_i;
      } else {
        // erase next letter
        --text_i;
      }
    }

    document.getElementById("typewriter-title").innerHTML = text.substr(0, text_i);
  }

  if ( cursor_held < cursor_time ) {
    cursor_held += speed;
  } else {
    if ( cursor_status ) {
      document.getElementById("typewriter-title").style.boxShadow = "3px 0px var(--viridian)";
      cursor_status = false;
      cursor_held = 0;
    } else {
      document.getElementById("typewriter-title").style.boxShadow = "0px 0px var(--viridian)";
      cursor_status = true;
      cursor_held = 0;
    }
  }
  
  setTimeout(typeWriter, speed);
}
