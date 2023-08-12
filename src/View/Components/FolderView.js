import { useEffect, useState } from "react";
import FolderSelector from "./FolderSelector";
import FolderElement from "./FolderElement";
import FileElement from "./FileElement";

function FolderView({setFile, currentPath, setCurrentPath, setFolderStats, setDetailType}) {
	const parent_dir = "..";

	const [currentFolders, setCurrentFolders] = useState([]);
	const [currentFiles, setCurrentFiles] = useState([]);

	const [currentFolder, setCurrentFolder] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			let folders = await window.myAPI.getFoldersByFolder(currentFolder);
			let files = await window.myAPI.getFilesByFolder(currentFolder);
			setCurrentFolders(folders);
			setCurrentFiles(files);
			setFolderStats([folders.length, files.length])
		}
		fetchData();
	}, [setCurrentFolders, setCurrentFiles, setFolderStats, currentFolder]);

	async function resetDirs() {
		//setCurrentPath([]);
		//setCurrentFolder(null)
		setCurrentFolders(await window.myAPI.getFoldersByFolder(null))
		setCurrentFiles(await window.myAPI.getFilesByFolder(null))
	}

	function changeDirFunc(folder) {
		let path = currentPath.slice();
		path.push([folder.id, folder.name]);
		setCurrentPath(path);
		setCurrentFolder(folder.id)
	}

	function changeDirUpFunc() {
		let path = currentPath.slice();
		path.pop();
		setCurrentPath(path);
		setCurrentFolder(path[path.length - 1]);
	}

	function renderFolderSelector() {
		if (currentPath.length === 0) {
			return <FolderSelector resetDirs={resetDirs} />
		}
	}
	
	function renderBackButton() {
		if (currentPath.length !== 0) {
			return <FolderElement
				type={'back'}
				folderElement={parent_dir}
				setDetailType={setDetailType}
				customFunc={() => changeDirUpFunc()} />
		}
	}

	return <section id="content">
		{renderBackButton()}
		{currentFolders.map((folderElement, index) => 
			<FolderElement
				key={index}
				type={'folders'}
				folderId={folderElement.id}
				folderElement={folderElement.name}
				folder={folderElement}
				setFile={setFile}
				setDetailType={setDetailType}
				customFunc={() => changeDirFunc(folderElement)} />
		)}
		{currentFiles.map((file_element, index) => 
			<FileElement
				key={index}
				setFile={setFile}
				setDetailType={setDetailType}
				file_element={file_element} />
		)}
		{renderFolderSelector()}
	</section>;
}

export default FolderView;