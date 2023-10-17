const { webContents } = require('electron');

class AlertHandler {
	sendAlert(alert) {
		webContents.getFocusedWebContents().send('add-alert', alert);
	}

	removeAlert(index) {
		webContents.getFocusedWebContents().send('remove-alert', index);
	}
}

module.exports = new AlertHandler();
