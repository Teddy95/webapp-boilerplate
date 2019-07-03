/**
 * Autor: Andre Sieverding
 * Copyright © 2019
 */

// Include required library
const { app, BrowserWindow } = require('electron')

// Include Webapplication
// require('./server')

let mainWindow

// Create new window
function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	})

	// mainWindow.loadURL('http://localhost:8080')
	mainWindow.loadFile(__dirname + './template.html')

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (mainWindow === null) createWindow()
})
