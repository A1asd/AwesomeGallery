import './App.css';
import Details from './Components/Details';
import Content from './Components/Content';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import GalleryView from './Components/GalleryView';
import TagView from './Components/TagView';
import FolderView from './Components/FolderView';

const initFolders = {
	name: '',
	path: '',
	folders: [],
	files: [],
	setFolder(folder){this.folders = folder},
	addFile(file){this.folders.push(file)},
};

function App() {
	const [file, setFile] = useState();
	const [currentPath, setCurrentPath] = useState([]);
	const [folderStructure, setCurrentFolderStructure ] = useState(initFolders);
	const [viewMode, setViewMode ] = useState('folders');
	const [tags, setTags] = useState([]);

	function handleFileChange(file) {
		setFile(file);
	}

	useEffect(() => {
		const fetchData = async () => {
			let folders = await window.myAPI.getFolders();
			if (folders.length > 0) {
				folders.forEach(folder => {
					folderStructure.folders.push(folder);
				});
			}
			setTags(await window.myAPI.getTags());
		}
		fetchData();
	}, [folderStructure, setTags]);

	function handleCurrentPathChange(path) {
		setCurrentPath(path);
	}

	function changeCurrentDirs(folder) {
		let updatedFolders = Object.assign(Object.create(Object.getPrototypeOf(initFolders)),initFolders);
		//updatedFolders.setFolder(folder);
		setCurrentFolderStructure(updatedFolders);
	}

	function renderDetails(file) {
		if (file) return <Details details={file} />
	}

	function renderContent() {
		if (viewMode === 'folders') {
			//return <FolderView></FolderView>
			return <Content folders={folderStructure} currentPath={currentPath} handleFileChange={handleFileChange} handleCurrentPathChange={handleCurrentPathChange} changeCurrentDirs={changeCurrentDirs} />
		} else if (viewMode === 'tags') {
			return <TagView></TagView>
		} else if (viewMode === 'gallery') {
			return <GalleryView></GalleryView>
		} else {
			return <div>nothing to show</div>
		}
	}

	return <div id="app">
			<Header currentPath={currentPath} folderStructure={folderStructure} />
			<Sidebar setViewMode={setViewMode} />
			{renderContent()}
			{renderDetails(file)}
			<Footer currentPath={currentPath} folderStructure={folderStructure} />
		</div>;
}

export default App;
