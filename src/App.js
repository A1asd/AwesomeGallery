import './App.css';
import Details from './Components/Details';
import Content from './Components/Content';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState } from 'react';
import Folder from './Classes/Folder';
import File from './Classes/File';
import Tags from './Services/TagManager';


//import { createRoot } from 'react-dom/client';

const files = [
	new File("cute.jpg", [Tags.CUTE, Tags.SELFIE]),
	new File("spoopy.png", [Tags.HORROR, Tags.SELFIE]),
]

const initFolders = new Folder('')
.addFolder(new Folder('Japan')
	.addFolder(
		new Folder('folder')
		.addFolder(
			new Folder('too_deep')
			.addFile(
				new File('nothing')
			)
		).addFolder(
			new Folder('whatever')
		)
		.addFile(
			files[1]
		)
	).addFile(
		files[0]
	)
);

function App() {
	const [file, setFile] = useState({name:"", tags:[]});
	const [currentPath, setCurrentPath] = useState([]);
	const [folderStructure, setCurrentFolderStructure ] = useState(window.myAPI.getFolders());

	function handleFileChange(file) {
		setFile(file);
	}

	function handleCurrentPathChange(path) {
		setCurrentPath(path);
	}

	function createDirectoryRecursive(name, dirs, files, absolute) {
		let parentFolder = new Folder(name, absolute);
		files.map(file => parentFolder.addFile(new File(file, absolute)))

		dirs.map(dir => parentFolder.addFolder(createDirectoryRecursive(dir[0], dir[1], dir[2], dir[3])));
		return parentFolder;
	}

	function changeCurrentDirs(parent, dirs, files, absolute) {
		let updatedFolders = Object.assign(Object.create(Object.getPrototypeOf(initFolders)),initFolders);
		updatedFolders.addFolder(createDirectoryRecursive(parent, dirs, files, absolute));
		setCurrentFolderStructure(updatedFolders);
	}

	return <div id="app">
			<Header currentPath={currentPath} folderStructure={folderStructure} />
			<Content folders={folderStructure} currentPath={currentPath} handleFileChange={handleFileChange} handleCurrentPathChange={handleCurrentPathChange} changeCurrentDirs={changeCurrentDirs} />
			<Footer currentPath={currentPath} folderStructure={folderStructure} />
			<Sidebar />
			<Details details={file} />
		</div>;
}

export default App;
