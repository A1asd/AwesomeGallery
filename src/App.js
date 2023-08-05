import './App.css';
import Details from './Components/Details';
import Content from './Components/Content';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import Folder from './Classes/Folder';

const initFolders = new Folder('')
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
				folderStructure.addFolder({
					name: folders[0].name || '',
					folders: folders[0].folders,
					files: folders[0].files,
					path: folders[0].path,
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

	return <div id="app">
			<Header currentPath={currentPath} folderStructure={folderStructure} />
			<Content folders={folderStructure} currentPath={currentPath} handleFileChange={handleFileChange} handleCurrentPathChange={handleCurrentPathChange} changeCurrentDirs={changeCurrentDirs} />
			<Footer currentPath={currentPath} folderStructure={folderStructure} />
			<Sidebar />
			{renderDetails(file)}
		</div>;
}

export default App;
