// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    }
    catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }
    finally {
      document.body.removeChild(textarea);
    }
  }
}

async function copybibtex(bibfile) {
  console.log(bibfile);
  var contents = false;
  var request = new XMLHttpRequest();
  
  try {
    request.open("GET", bibfile, true);
    request.onload = (e) => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          // Fetch the response.
          contents = request.responseText;

          // Log the result.
          console.log(contents);

          // Copy to the clipboard.
          copyToClipboard(contents);
          
        } else {
          console.error(request.statusText);
        }
      }
    };
    request.onerror = (e) => {
      console.error(request.statusText);
    };
    request.send();
    
  } catch (error) {
    alert(error);
    console.log("Couldn't send GET request");
    
  }
}
