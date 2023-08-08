function FileElement(props) {
	let file = props.file_element;
	return <div className="file" onClick={() => props.handleFileChange(file)}>
			<img className="thumbnail" src={"./img/images.svg"} alt="a" />
			<span>{file.name}</span>
		</div>;
}

export default FileElement;
