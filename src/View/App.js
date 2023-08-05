import './App.css';
import Details from './Components/Details';
import Content from './Components/Content';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';

const initFolders = {
	name: '',
	path: '',
	folders: [],
	files: [],
};
function App() {
	const [file, setFile] = useState();
	const [currentPath, setCurrentPath] = useState([]);
	const [folderStructure, setCurrentFolderStructure ] = useState(initFolders);
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
		updatedFolders.addFolder(folder);
		setCurrentFolderStructure(updatedFolders);
	}

	function renderDetails(file) {
		if (file) return <Details details={file} />
	}

	function renderContent(viewmode = 'gallery') {
		if (viewmode === 'gallery') {
			return <Content folders={folderStructure} currentPath={currentPath} handleFileChange={handleFileChange} handleCurrentPathChange={handleCurrentPathChange} changeCurrentDirs={changeCurrentDirs} />
		} else {
			return <div>nothing to show</div>
		}
	}

	return <div id="app">
			<Header currentPath={currentPath} folderStructure={folderStructure} />
			<Sidebar />
			{renderContent('gallery')}
			{renderDetails(file)}
			<Footer currentPath={currentPath} folderStructure={folderStructure} />
		</div>;
}

export default App;
