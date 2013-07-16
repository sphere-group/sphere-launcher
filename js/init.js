/******************************
 * Begin here.                *
 * Inits when page is loaded. *
 ******************************/
var DEBUG = true;
var game_manager;

//Init some libraries
try {
  var fs = require("fs");
  var os = require("os");
  var gui = require('nw.gui');
  var marked = require("marked");
}
catch (e) {
  if (e.toString().indexOf("not defined") > -1)
    $(document).ready(function() {
      $("#main").html("<br>ERROR: "+e+'<br><br>Please do not open this file in the browser. Run it with <a href="https://github.com/rogerwang/node-webkit" target="_blank">Node-Webkit</a> instead!');
    });
}


//Begin it all!
$(document).ready(function() { Init(); });

function Init() {
  if (DEBUG)
    $("header h2").append(' <a id="showdevtools" href="javascript:void(0)"><img src="resources/utilities-terminal.png" width="16" height="16" alt="Show dev tools"></a>');
  
  $("#showdevtools").click(function() { gui.Window.get().showDevTools(); });
  
  //Add game list to page
  game_manager = new GameManager();
  document.getElementById("gamelist").innerHTML = game_manager.listGames();
  
  //Override default link behaviours
  $("a").click(function(e) {
    e.preventDefault();
  });
  
  $(".gameheader a.expand").click(function() {
    var wasopen = $(this).parent().parent().hasClass("selected");
    $(".selected").removeClass("selected");
    if (wasopen) return;
    $(this).parent().parent().addClass("selected");
  });
  
  //Launch a game
  $("a.launchbutton").click(function() {
    //alert("Launching Sphere - to do");
    //LaunchGame('C:\\Users\\Vincent\\Dropbox\\Sphere\\sphere1.5\\games\\Aquatis - Journey To Kiltos (game only)', CONFIG.engines[0]);
    //alert($(this).attr("data-path"));
    LaunchGame($(this).attr("data-path"), CONFIG.engines[0]);
  });
  
  //Open external links
  $('a[target=_blank]').click(function(e) {
    OpenURL($(this).attr("href"));
  });
}