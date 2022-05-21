var arr_i = 0;
var text_i = 0;
var texts = ['Computer Scientist', 'Compiler Researcher', 'Computer Engineer'];
var text = texts[0];
var typing = true;
var holding = false;
var speed = 200;
var cursor_status = true;
var cursor_time = 2 * speed;
var cursor_held = 0;
var full_hold_time = 1600;
var empty_hold_time = 800;
var hold_time = full_hold_time;
var time_held = 0;
var num_blinks = 3;
var blinks = 0;

function typeWriter() {
  if (holding) {
    if (time_held < hold_time) {
      time_held += speed;
    } else {
      time_held = 0;
      holding = false;
      typing = !typing;
    }
  } else {
    if (typing) {
      if (text_i >= text.length) {
        hold_time = full_hold_time;
        holding = true;
        time_held = 0;
      }
    } else {
      if (text_i < 0) {
        arr_i = (arr_i + 1) % (texts.length);
        text = texts[arr_i];

        hold_time = empty_hold_time;
        holding = true;
        time_held = 0;
      }
    }

    if (!holding) {
      if (typing) {
        // type next letter
        ++text_i;
      } else {
        // erase next letter
        --text_i;
      }
    }

    document.getElementById("typewriter-title").innerHTML = "<b> > </b>" + text.substr(0, text_i);
  }

  if (holding) {
    if (cursor_held < cursor_time) {
      cursor_held += speed;
    } else {
      cursor_status = !cursor_status;
    }
  } else {
    cursor_status = true;
  }

  if (cursor_status) {
    document.getElementById("typewriter-title").style.boxShadow = "3px 0px var(--fire-opal)";
    cursor_status = false;
    cursor_held = 0;
  } else {
    document.getElementById("typewriter-title").style.boxShadow = "0px 0px var(--fire-opal)";
    cursor_status = true;
    cursor_held = 0;
  }

  setTimeout(typeWriter, speed);
}
