import { useState } from "react";
import Alert from "./Alert";

function AlertBox() {
	const [alerts, setAlerts] = useState([]);

	window.myAPI.onAddAlert((_event, value) => {
		let nAlerts = alerts.slice();
		nAlerts.push(value);
		setAlerts(nAlerts);
	})

	window.myAPI.onRemoveAlert((_event, index) => {
		removeAlertByIndex(index);
	})

	function removeAlertByIndex(index) {
		let nAlerts = alerts.slice();
		nAlerts.splice(index, 1);
		setAlerts(nAlerts);
	}

	if (alerts.length > 0) {
		return <div id="alert-box">
				{alerts.map((alert, index) =>
					<Alert alert={alert} removeAlert={() => removeAlertByIndex(index)}/>
				)}
			</div>;
	}
}

export default AlertBox;
