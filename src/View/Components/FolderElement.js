function FolderElement(props) {
	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				props.customFunc()
				//console.log('selecting folder: ' + props.folderElement)
				break;
			case 2:
				//window.myAPI.saveFolderToCollection(props.folderId)
				break;
			default:
		}
	} //onClick={handleClickEvent}
	return <div className="folder" onClick={(e) => handleClickEvent(e)}>
			<img className="thumbnail" src={"./img/" + props.type + ".svg"} alt="folder" />
			<span className="folder-title">{props.folderElement}</span>
		</div>;
}

export default FolderElement;
