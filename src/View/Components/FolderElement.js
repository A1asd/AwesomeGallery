function FolderElement({type, folderId, folderElement, customFunc, folder, setFile}) {
	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				//console.log('selecting folder: ' + folder)
				if (type !== 'back')
					setFile([folder, 'folder']);
				break;
			case 2:
				customFunc()
				//window.myAPI.saveFolderToCollection(props.folderId)
				break;
			default:
		}
	} //onClick={handleClickEvent}
	return <div className="folder" onClick={(e) => handleClickEvent(e)}>
			<img className="thumbnail" src={"./img/" + type + ".svg"} alt="folder" />
			<span className="folder-title">{folderElement}</span>
		</div>;
}

export default FolderElement;
