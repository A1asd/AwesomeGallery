import './App.css';
import Details from './Components/Details';
import Content from './Components/Content';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import Folder from './Classes/Folder';
import File from './Classes/File';
import Tags from './Services/TagManager';


//import { createRoot } from 'react-dom/client';

//const files = [
//	new File("cute.jpg", [Tags.CUTE, Tags.SELFIE]),
//	new File("spoopy.png", [Tags.HORROR, Tags.SELFIE]),
//]

const initFolders = new Folder('')
//.addFolder(new Folder('Japan')
//	.addFolder(
//		new Folder('folder')
//		.addFolder(
//			new Folder('too_deep')
//			.addFile(
//				new File('nothing')
//			)
//		).addFolder(
//			new Folder('whatever')
//		)
//		.addFile(
//			files[1]
//		)
//	).addFile(
//		files[0]
//	)
//);

function App() {
	const [file, setFile] = useState({name:"", tags:[]});
	const [currentPath, setCurrentPath] = useState([]);
	//const [initialFolders, setInitialFolders] = useState(new Folder(''));
	const [folderStructure, setCurrentFolderStructure ] = useState(initFolders);
	function handleFileChange(file) {
		setFile(file);
	}

	//const [cont, setContent] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			let response = await window.myAPI.getFolders();
			//console.log(response[0]);
			//console.log(initFolders.folders[0]);
			//setContent(response);
			folderStructure.addFolder({
				name: response[0].name,
				folders: response[0].folders,
				files: response[0].files,
				path: response[0].path,
			});
		}
		fetchData();
	}, [folderStructure]);

	function handleCurrentPathChange(path) {
		setCurrentPath(path);
	}

	//function createDirectoryRecursive(name, dirs, files, parent) {
	//	let parentFolder = new Folder(name, parent);
	//	files.map(file => parentFolder.addFile(new File(file, parent)))

	//	dirs.forEach((dir) => {
	//		parentFolder.addFolder(createDirectoryRecursive(dir.name, dir.folders, dir.files, dir.parent))
	//	});
	//	return parentFolder;
	//}

	function changeCurrentDirs(folder) {
		//folder = Object.assign(new Folder(), folder);
		//console.log(folder);
		let updatedFolders = Object.assign(Object.create(Object.getPrototypeOf(initFolders)),initFolders);
		//updatedFolders.addFolder(createDirectoryRecursive(name, dirs, files, parent));
		updatedFolders.addFolder(folder);
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
