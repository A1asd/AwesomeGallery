function FolderElement(props) {
	return <div onClick={() => props.customFunc()}>{props.folderElement}</div>;
}

export default FolderElement;
