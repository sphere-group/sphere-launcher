/********************
 * Common functions *
 ********************/

/** Get the directory list of a path */
function GetDirectoryList(path) {
  if (!path || !fs.existsSync(path)) { console.log("No path given!"); return undefined; }
  var dir = fs.readdirSync(path);
  var results = [];
  
  //Find which stuff is a directory and only add those.
  for (var i in dir) {
    if (fs.statSync(path+"/"+dir[i]).isDirectory()) results.push(dir[i]);
  }
  
  //console.log(results);
  return results;
}


/** Open an URL in an external window. */
function OpenURL(url) {
  var win = gui.Window.get();

  // Create a new window and get it
  var win = gui.Window.open(url, {
    position: 'center',
    width: 800,
    height: (window.screen.height > 800 ? 800 : 600)
  });
  
}


/** Find all occurrences of something in a string.
 * Taken from http://stackoverflow.com/questions/3410464/
 * Answer 2, jcubic's answer. Thanks!
 */
function indexes(source, find) {
  var result = [];
  for(i=0;i<source.length; ++i) {
    // If you want to search case insensitive use 
    // if (source.substring(i, i + find.length).toLowerCase() == find) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
}


/** Launch the given game with the given engine. */
function LaunchGame(game, engine) {
  var command = require('child_process').spawn(engine, ["-game", game]);
}