  <!-- ///////
      // Copyright by FREI.media - All rights reserved.
  //////////// --> 

  var countLied = 1;
  var next = 1;

  $(document).ready(function() {
  // Erstelle Datenbank falls noch nicht vorhanden
  initDatabase();
  // Lade Daten aus Datenbank
  showRecords();

  // Zeige an, dass im Bearbeitungs-Modus
  displayEditMode();

  // Listener fuer neue Eingabe-Felder
  $(".add-more").click(addItem);
});

  function addItem(e, value, startup) {
    if(startup == false) {
      e.preventDefault();
    }
    if (!value) {
      value = ""
    }

    var addto = "#field" + next;
    var addRemove = "#field" + (next);
    next = next + 1;
    
    var newIn = '<input autocomplete="off" class="input-lg form-control lied-item" id="field' + next + '" name="field' + next + '" type="text" value="'+value+'" placeholder="Text eingeben..." />';
    var newInput = $(newIn);
    var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-lg btn-danger remove-me" onclick="reduceCountLied();" >Entfernen</button></div><div id="field">';
    var removeButton = $(removeBtn);
    $(addto).after(newInput);
    $(addRemove).after(removeButton);
    $("#field" + next).attr('data-source',$(addto).attr('data-source'));
    $("#count").val(next); 
    countLied++;

    $('.remove-me').click(function(e) {
      e.preventDefault();
      var fieldNum = this.id.charAt(this.id.length-1);
      var fieldID = "#field" + fieldNum;
      $(this).remove();
      $(fieldID).remove();
    });
  };

  function reduceCountLied() {
    countLied--;
  }

  function displayEditMode() {
    var fsStatus = $('#fsstatus');
    fsStatus.empty();
    fsStatus.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"> </span> <b>Eingabe-Modus!</b>');
    fsStatus.removeClass('alert-success');
    fsStatus.addClass('alert alert-warning');
  }

/* 
Native FullScreen JavaScript API
-------------
Assumes Mozilla naming conventions instead of W3C for now
*/

(function() {
  var 
  fullScreenApi = { 
    supportsFullScreen: false,
    isFullScreen: function() { return false; }, 
    requestFullScreen: function() {}, 
    cancelFullScreen: function() {},
    fullScreenEventName: '',
    prefix: ''
  },
  browserPrefixes = 'webkit moz o ms khtml'.split(' ');
  
  // check for native support
  if (typeof document.cancelFullScreen != 'undefined') {
    fullScreenApi.supportsFullScreen = true;
  } else {   
    // check for fullscreen support by vendor prefix
    for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
      fullScreenApi.prefix = browserPrefixes[i];
      
      if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
        fullScreenApi.supportsFullScreen = true;
        
        break;
      }
    }
  }
  
  // update methods to do something useful
  if (fullScreenApi.supportsFullScreen) {
    fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
    
    fullScreenApi.isFullScreen = function() {
      switch (this.prefix) {  
        case '':
        return document.fullScreen;
        case 'webkit':
        return document.webkitIsFullScreen;
        default:
        return document[this.prefix + 'FullScreen'];
      }
    }
    fullScreenApi.requestFullScreen = function(el) {
      return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
    }
    fullScreenApi.cancelFullScreen = function(el) {
      return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
    }   
  }

  // jQuery plugin
  if (typeof jQuery != 'undefined') {
    jQuery.fn.requestFullScreen = function() {
      
      return this.each(function() {
        var el = jQuery(this);
        if (fullScreenApi.supportsFullScreen) {
          fullScreenApi.requestFullScreen(el);
        }
      });
    };
  }

  // export api
  window.fullScreenApi = fullScreenApi; 
})();



// do something interesting with fullscreen support
var fsButton = document.getElementById('fsbutton'),
fsElement = document.getElementById('anzeige-container'),
fsStatus = document.getElementById('fsstatus');

if (window.fullScreenApi.supportsFullScreen) {
  //fsStatus.innerHTML = 'YES: Your browser supports FullScreen';
  displayEditMode();  
  fsStatus.className = 'fullScreenSupported';
  
  // handle button click
  fsButton.addEventListener('click', function() {
    window.fullScreenApi.requestFullScreen(fsElement);
  }, true);
  
  fsElement.addEventListener(fullScreenApi.fullScreenEventName, function() {
    if (fullScreenApi.isFullScreen()) {
      var output_text = '<div id="anzeige" style="height:auto;">'
      for(i=0; i<countLied; i++) {
        input_value = document.getElementsByClassName("lied-item")[i].value
        if(i==countLied-1 && input_value == "") {
          break;
        }
        output_text += input_value
        output_text += '<br>'
      }
      output_text += '</div>'
      fsElement.innerHTML = output_text;
      fsStatus.innerHTML = 'Vorführung';

      // Skaliere Schrift im Projektionsmodus
      var fontSize = 14;
      var changes = 0;
      var blnSuccess = true;
      var oDiv = document.getElementById("anzeige");
      oDiv.style.overflow = "auto";

      while (oDiv.clientHeight <= fsElement.clientHeight) {
        
        oDiv.style.fontSize = fontSize + "px";
        fontSize++;
        changes++;
        if (changes > 5000) {
          console.log("changes>5000");
          blnSuccess = false;
          break;
        }
      }
      if (changes > 0) {
        console.log("changes>0");
            //upon failure, revert to original font size:
            if (blnSuccess){
              console.log("blnSuccess");
              fontSize -= 2;
            }
            else
              fontSize -= changes;
            oDiv.style.fontSize = fontSize + "px";
          }

        } else {
          displayEditMode();
          fsElement.innerHTML = "";
        }
      }, true);
  
} else {
  fsStatus.innerHTML = 'Achtung: Ihr Browser unterst&uuml;tzt den Vollbild-Modus nicht!';
}
