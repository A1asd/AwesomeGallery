//import path from 'path';

//window.addEventListener('contextmenu', (e) => {
//  e.preventDefault()
//  window.myAPI.showContextMenu();
//})

function FileElement({setFile, index, setViewerFile, setViewingGroupPreset, file}) {
	function invokeContextMenu(event) {
		event.preventDefault();
		window.myAPI.showImageContextMenu(file);
	}

	return <div className="file" onContextMenu={(e) => invokeContextMenu(e)} onClick={() => {setFile([file, 'file']); setViewerFile(index); setViewingGroupPreset()}}>
			<img className="thumbnail" src={file.path + '/' + file.name} alt="a" />
			<span>{file.name}</span>
		</div>;
}

export default FileElement;
