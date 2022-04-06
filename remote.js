// Tweaking CodeMirror is fun

var toolbar = document.getElementsByClassName("tool-bar")[0];


function registerButton(name, callback, fa=null) {
	var node = document.createElement("a");
	if (fa) {
		node.classList.add("fa");
		node.classList.add(fa);
	} else
		node.innerHTML = name;
	toolbar.appendChild(node);
	node.addEventListener("click", callback);
}

function insertText (text, cursorEnd = 0) {
  const cursor = editor.getCursor()
  editor.replaceSelection(text, cursor, cursor)
  editor.focus()
  editor.setCursor({ line: cursor.line, ch: cursor.ch + cursorEnd })
}

function wrapTextWith (symbol) {
  var closing = symbol;
    if (symbol[0] == "<")
      closing = "</" + symbol.slice(1);

  cm = editor
  if (!cm.getSelection()) {
    insertText(symbol + closing, symbol.length)
  } else {
    const ranges = cm.listSelections()
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      if (!range.empty())  {
        const from = range.from()
        const to = range.to()

        if (symbol !== 'Backspace') {
          const selection = cm.getRange(from, to)
          const anchorIndex = editor.indexFromPos(ranges[i].anchor)
          const headIndex = editor.indexFromPos(ranges[i].head)
          cm.replaceRange(symbol + selection + closing, from, to, '+input')
          // Multiple select funktioniert nicht, könnte gefixt werden
          if (anchorIndex > headIndex) {
            ranges[i].anchor.ch += symbol.length
            ranges[i].head.ch += symbol.length
          } else {
            ranges[i].head.ch += symbol.length
            ranges[i].anchor.ch += symbol.length
          }
          cm.setSelections(ranges)
        } else {
          const preEndPos = {
            line: to.line,
            ch: to.ch + symbol.length
          }
          const preText = cm.getRange(to, preEndPos)
          const preIndex = wrapSymbols.indexOf(preText)
          const postEndPos = {
            line: from.line,
            ch: from.ch - symbol.length
          }
          const postText = cm.getRange(postEndPos, from)
          const postIndex = wrapSymbols.indexOf(postText)
          // check if surround symbol are list in array and matched
          if (preIndex > -1 && postIndex > -1 && preIndex === postIndex) {
            cm.replaceRange('', to, preEndPos, '+delete')
            cm.replaceRange('', postEndPos, from, '+delete')
          }
        }
      }
    }
  }
}

registerButton("TeX", function(e) {
   wrapTextWith("$");
});

registerButton('<span style="font-size:smaller">img</span>', function(e) {
   insertText('![](https://ux4.edvschule-plattling.de/~lfuhr/i/)');
});

registerButton('<span style="font-size:smaller">SVG</span>', function() {
  navigator.clipboard.readText().then(text => {
    const encoded = encodeURIComponent(text);
    alert(encoded)
    insertText('<img src="data:image/svg+xml;utf8,'+encoded+'"/>');
  });
});

registerButton('<span class="fa fa-code"></span>', function(e) {
   wrapTextWith("\n```\n");
});



registerButton('<s><span style="font-size:smaller">ins</span></s>', function(e) {
     let text = editor.getValue()
     text = text.replace(/\+\+(?=\S).*?(?<=\S)\+\+/g, '')
     text = text.replace(/<ins>[\s\S]*?<\/ins>/g, '') // Multi line
     editor.setValue(text);
});

registerButton('<span style="font-size:smaller">ins</span>', function(e) {
   wrapTextWith("<ins>");
});

registerButton('<span style="font-size:smaller">++</span>', function(e) {
   wrapTextWith("++");
});

// frei unter Mac ctrl+ "c", "g", "j", "l", "q", "r", "u", "w", "x", "z"
// Windows Q,Z(Y-Taste)
// document.addEventListener('keypress', function(e) {
//     if ((e.ctrlKey || e.metaKey) && (e.key == "j")) {
//         document.execCommand('insertText', false, 'message')
//     }
// });

