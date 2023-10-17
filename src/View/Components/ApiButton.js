function ApiButton({apiFunction, linkLabel, removeAlert}) {
	// 0: api, 1: function, 2: parameter
	var splitLink = apiFunction.split(':');

	return <span class='clickable' onClick={() => {
			window[splitLink[0]][splitLink[1]](splitLink[2]);
			removeAlert()
		}}>
			{linkLabel}
		</span>;
}

export default ApiButton;
