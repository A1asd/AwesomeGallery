import { useEffect, useState } from "react";
import FolderSelector from "./FolderSelector";
import FolderElement from "./FolderElement";
import FileElement from "./FileElement";

function FolderView({setFile, setViewerFile, setViewingGroup, currentPath, setCurrentPath, setFolderStats, setDetailType, detailsVisible}) {
	const parent_dir = "..";

	const [currentFolders, setCurrentFolders] = useState([]);
	const [currentFiles, setCurrentFiles] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			let folders = await window.myAPI.getFoldersByFolder(currentPath[currentPath.length - 1] ? currentPath[currentPath.length - 1][0] : null);
			let files = await window.myAPI.getFilesByFolder(currentPath[currentPath.length - 1] ? currentPath[currentPath.length - 1][0] : null);
			setCurrentFolders(folders);
			setCurrentFiles(files);
			setFolderStats([folders.length, files.length])
		}
		fetchData();
	}, [setCurrentFolders, setCurrentFiles, setFolderStats, currentPath]);

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
	}

	function changeDirUpFunc() {
		let path = currentPath.slice();
		path.pop();
		setCurrentPath(path);
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

	function setViewingGroupPreset() {
		setViewingGroup(currentFiles);
	}

	return <section id="content" className={'folder-view' + (!detailsVisible ? ' details-invisible' : '')}>
		{renderBackButton()}
		{currentFolders.map((folderElement, index) =>
			<FolderElement key={index} type={'folders'} folderId={folderElement.id} folderElement={folderElement.name} folder={folderElement} setFile={setFile} setDetailType={setDetailType} customFunc={() => changeDirFunc(folderElement)} />
		)}
		{currentFiles.map((file, index) =>
			<FileElement key={index} index={index} setFile={setFile} setViewerFile={setViewerFile} setViewingGroupPreset={setViewingGroupPreset} setDetailType={setDetailType} file={file} />
		)}
		{renderFolderSelector()}
	</section>;
}

export default FolderView;
