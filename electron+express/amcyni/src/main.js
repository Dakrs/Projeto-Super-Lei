const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const LoadingWindow = require('./Electron/LoadingWindow');
const MainWindow = require('./Electron/MainWindow');
import setIpc from './MainIpc';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var webServer;
var shuttingDown;
const log = require('electron-log');

// Make sure to set the logging level to the
log.transports.console.level = 'info';
log.transports.file.level = 'info';

function startExpress() {

	// Create the path of the express server to pass in with the spawn call
	var webServerDirectory = './Api/bin/www';
	log.info('starting node script: ' + webServerDirectory);

	var nodePath = "/usr/local/bin/node";
	if (process.platform === 'win32') {
		// Overwrite with the windows path...only testing on mac currently
	}

	// Optionally update environment variables used
	var env = JSON.parse(JSON.stringify(process.env));

	// Start the node express server
	const spawn = require('child_process').spawn;
	webServer = spawn(nodePath,[webServerDirectory], {
		env : env
	});

	// Were we successful?
	if (!webServer) {
		log.info("couldn't start web server");
		return;
	}

	// Handle standard out data from the child process
	webServer.stdout.on('data', function (data) {
		log.info('data: ' + data);
	});

	// Triggered when a child process uses process.send() to send messages.
	webServer.on('message', function (message) {
		log.info(message);
	});

	// Handle closing of the child process
	webServer.on('close', function (code) {
		log.info('child process exited with code ' + code);
		webServer = null;

		// Only restart if killed for a reason...
		if (!shuttingDown) {
			log.info('restarting...');
			startExpress();
		}
	});

	// Handle the stream for the child process stderr
	webServer.stderr.on('data', function (data) {
		log.info('stderr: ' + data);
	});

	// Occurs when:
	// The process could not be spawned, or
	// The process could not be killed, or
	// Sending a message to the child process failed.
	webServer.on('error', function (err) {
		log.info('web server error: ' + err);
	});

}



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let loadwin = null;
let mainwin = null;

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }   

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function () {
  shuttingDown = false;
  startExpress()
  await sleep(1000);
  loadwin = new LoadingWindow();

  loadwin.window.once('show',() => {
    mainwin = new MainWindow();
    mainwin.window.once('ready-to-show',() => {
      mainwin.window.show();
      loadwin.window.hide();
      loadwin.window.close();
    });
  });
  loadwin.window.show();
});

// Called before quitting...gives us an opportunity to shutdown the child process
app.on('before-quit',function()
{
	log.info('gracefully shutting down...');

	// Need this to make sure we don't kick things off again in the child process
	shuttingDown = true;

	// Kill the web process
	webServer.kill();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});


process.on("SIGINT", function () {
	//graceful shutdown
	log.info('shutting down...');
	process.exit();
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
setIpc();
