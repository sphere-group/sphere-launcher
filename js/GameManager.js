/*************************
 * Game Manager          *
 * Manages the game list *
 *************************/

function GameManager() {
  this.games = [];
  this.sourcepaths = CONFIG.gamepaths;
  this.dirs = [];
  
  //Iterate through all given game paths
  for (var i = 0; i < this.sourcepaths.length; i++) {
    this.dirs[i] = GetDirectoryList(this.sourcepaths[i]);
    if (this.dirs[i] != undefined) {
      //Add games to list
      for (var j in this.dirs[i]) {
        if (fs.existsSync(this.sourcepaths[i]+"/"+this.dirs[i][j]+"/"+"game.sgm")) { //Only if it's a project dir
          this.games.push( new Game(this.dirs[i][j], this.sourcepaths[i]) );
        }
      }
    }//End (if dirs[i] != undefined)
  }
  
  
  /** List games as HTML output */
  this.listGames = function() {
    var list = "";
    for (var i in game_manager.games) {
      list += game_manager.games[i].getHTML();
    }
    return list;
  }
}



/** Game object containing the data about a game. */
function Game(dirname, basepath) {
  //TODO: clean stuff up
  this.dirname = dirname;
  this.basepath = basepath;
  if (this.basepath[this.basepath.length-1] != "/") this.basepath += "/"; //Add trailing slash
  this.fullpath = this.basepath + this.dirname + "/";
  this.hasinfofile = false;
  
  ////////////////////////
  //Load images and video
  this.icon = (fs.existsSync(this.fullpath+"icon.png")) ? this.fullpath+"icon.png" : "resources/sphere.svg";
  this.screenshot = (fs.existsSync(this.fullpath+"screenshot.png")) ? this.fullpath+"screenshot.png" : undefined;
  this.video = (fs.existsSync(this.fullpath+"video.webm")) ? this.fullpath+"video.webm" : undefined;
  
  ///////////////////////////
  //Load and process game.sgm
  var sgmdata = fs.readFileSync(this.fullpath+"game.sgm").toString();
  var lines = sgmdata.split("\n");
  var keys = [];
  var values = [];
  for (var i = 0; i < lines.length; i++) {
    var splitline = lines[i].split("=");
    keys[i] = splitline[0];
    values[i] = splitline[1];
  }
  this.name = values[keys.indexOf("name")];
  this.shortdescription = (values[keys.indexOf("description")] == undefined || values[keys.indexOf("description")] == "") ? "No description" : values[keys.indexOf("description")];
  this.author = values[keys.indexOf("author")];
  this.screen_width = values[keys.indexOf("screen_width")];
  this.screen_height = values[keys.indexOf("screen_height")];
  this.script = values[keys.indexOf("script")];
  
  
  ////////////////////////////
  //Load and process about.txt
  this.description = "<h1>Description</h1><p>" + this.shortdescription + "</p>";
  this.controls = "<h1>Controls</h1>No control info found in info.txt."
  
  if (fs.existsSync(this.fullpath+"info.txt")) {
    console.log("Found info.txt for " + this.name);
    this.hasinfofile = true;
    this.otherinfo = "";
    var txtdata = fs.readFileSync(this.fullpath+"info.txt").toString();
    
    //Get the first few lines up to the first heading, convert them to markdown and display them.
    var endpos = txtdata.indexOf("\n\n");
    this.info = marked(txtdata.substr(0, endpos));
    this.info = this.info.split("\n").slice(0, this.info.split("\n").length-1).join("<br>");  //Remove the last \n and replace the other ones with <br>
    this.info = this.info.split("<a").join('<a target="_blank"');
    
    //Get and split the other lines.
    var detailedinfo = marked(txtdata.substr(endpos));
    var infos = detailedinfo.split("<h1>");
    for (var i = 0; i < infos.length; i++) {
      switch($("<h1>"+infos[i]).html()) {
        case "Description":
          this.description = "<h1>"+infos[i];
          break;
        case "Credits":
          this.credits = "<h1>"+infos[i];
          break;
        case "Controls":
          this.controls = "<h1>"+infos[i];
          break;
        case "":
          break;
        default: //Dump the data of any custom headers here
          this.otherinfo += "<h1>"+infos[i];
          //alert(this.otherinfo);
      }
    }
  }//end process about.txt
  
  
  
  /** Get the game's info in HTML form. */
  this.getHTML = function() {
    var screenshotarea = "";
    if (this.video) screenshotarea = '<video src="' + this.video + '" controls></video>'
    else if (this.screenshot) screenshotarea = '<img src="' + this.screenshot + '" alt="screenshot">'
    else screenshotarea = '<br>No screenshot available';
    
    var html =
      '<li id="'+this.dirname+'">' +
      
      //Header bit
      '<div class="gameheader">' +
        '<a class="expand" href="javascript:void(0)">' +
        '<img src="'+this.icon+'" alt="game icon">' +
        '<p class="gametitle">'+this.name+'</p>' +
        '<p class="shortdescription">'+this.shortdescription+'</p>' +
        '</a>' +
      '</div>'+ //end gameheader
      
      '<a class="launchbutton" href="#" data-path="'+this.fullpath+'">Play game</a>' +
      '<p class="clear"></p>';
      
      //Big description bit
      if (this.hasinfofile) {
        html +=
        '<div class="gamedetails">' +
          '<p class="directory">Path: '+this.fullpath+'</p>' +
          '<div class="col">' +
            '<div class="description">'+this.description+'</div>' +
            '<div class="controls">'+this.controls+'</div>' +
          '</div>' + //end col
          
          '<div class="col">' + //col
            '<div class="screenshotarea">'+screenshotarea+'</div>' +
            '<div class="gameinfo">' +
              this.info +
            '</div>' + //end gameinfo
          '</div>' + //end col
        '</div>' + //end gamedetails
        '<p class="clear"></p>' +
        '</li>';
      }
      else {
        html +=
        '<div class="gamedetails">' +
        '<p class="directory">Path: '+this.fullpath+'</p>' +
        '</div>' +
        '<p class="clear"></p>';
      }
    
    return html;
  }
}