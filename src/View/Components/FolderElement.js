function FolderElement(props) {

	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				props.customFunc()
				//console.log('selecting folder: ' + props.folderElement)
				break;
			case 2:
				break;
			default:
		}
	} //onClick={handleClickEvent}
	return <div onClick={(e) => handleClickEvent(e)}>{props.folderElement}</div>;
}

export default FolderElement;
