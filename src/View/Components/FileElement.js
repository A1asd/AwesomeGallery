function FileElement(props) {
	let file = props.file_element;
	return <div onClick={() => props.handleFileChange(file)}>{file.name}</div>;
}

export default FileElement;
