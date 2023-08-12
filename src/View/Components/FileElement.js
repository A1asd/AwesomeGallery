//import path from 'path';

function FileElement({setFile, file_element}) {
	let file = file_element;
	return <div className="file" onClick={() => {setFile([file, 'file'])}}>
			<img className="thumbnail" src={file.path + '/' + file.name} alt="a" />
			<span>{file.name}</span>
		</div>;
}

export default FileElement;
