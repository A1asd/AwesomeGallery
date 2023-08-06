function FolderElement(props) {
	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				props.customFunc()
				//console.log('selecting folder: ' + props.folderElement)
				break;
			case 2:
				window.myAPI.saveFolderToCollection(props.folderId)
				break;
			default:
		}
	} //onClick={handleClickEvent}
	return <div onClick={(e) => handleClickEvent(e)}>{props.folderElement}</div>;
}

export default FolderElement;
