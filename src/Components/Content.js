import FolderElement from "./FolderElement";
import FileElement from "./FileElement";
import { useState } from "react";
import FolderSelector from "./FolderSelector";

function Content(props) {
	const parent_dir = "..";

	const [currentFolders, setCurrentFolders] = useState(props.folders.folders);
	const [currentFiles, setCurrentFiles] = useState(props.folders.files);

	function setCurrentDir(path) {
		let current_dir = props.folders;
		path.forEach(current => {
			current_dir = current_dir.folders[current]
		});
		setCurrentFolders(current_dir.folders);
		setCurrentFiles(current_dir.files);
	}

	function changeDirFunc(index) {
		let path = props.currentPath.slice(); //copy of currentPath because arrays dont work much do they?!
		path.push(index);
		props.handleCurrentPathChange(path);
		setCurrentDir(path);
	}

	function changeDirUpFunc() {
		let path = props.currentPath.slice(); //copy of currentPath because arrays dont work much do they?!
		path.pop();
		props.handleCurrentPathChange(path);
		setCurrentDir(path);
	}

	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				console.log('click');
				break;
			case 2:
				console.log('dblclick');
				break;
			default:
				console.log('noclick');
				break;
		}
	} //onClick={handleClickEvent}

	return <section id="content">
		<FolderElement folderElement={parent_dir} customFunc={() => changeDirUpFunc()} />
		{currentFolders.map((folderElement, index) => 
			<FolderElement key={index} folderElement={folderElement.name} customFunc={() => changeDirFunc(index)} />
		)}
		{currentFiles.map((file_element, index) => 
			<FileElement key={index} handleFileChange={props.handleFileChange} file_element={file_element} />
		)}
		<FolderSelector changeCurrentDirs={props.changeCurrentDirs} />
	</section>;
}

export default Content;
