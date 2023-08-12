import './App.css';
import Details from './Components/Details';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { useState } from 'react';
import GalleryView from './Components/GalleryView';
import TagView from './Components/TagView';
import FolderView from './Components/FolderView';
import ViewModeManager from './Services/ViewModeManager';

function App() {
	/** currentPath: [[folderid, foldername], [folderid, foldername], ...] */
	const [currentPath, setCurrentPath] = useState([]);
	const [file, setFile] = useState([]);
	/** viewMode: folders OR tags OR gallery */
	const [viewMode, setViewMode ] = useState(ViewModeManager.FOLDER);
	/** folderStats: [foldercount, filecount] */
	const [folderStats, setFolderStats] = useState([0,0]);

	function renderDetails(file) {
		if (file) return <Details details={file[0]} detailType={file[1]} />
	}

	function renderContent() {
		if (viewMode === ViewModeManager.FOLDER) {
			return <FolderView
				currentPath={currentPath}
				setCurrentPath={setCurrentPath}
				setFile={setFile}
				setFolderStats={setFolderStats} />
		} else if (viewMode === ViewModeManager.TAGS) {
			return <TagView
				setFile={setFile} />
		} else if (viewMode === ViewModeManager.GALLERY) {
			return <GalleryView />
		} else {
			return <div>nothing to show</div>
		}
	}

	return <div id="app">
			<Header currentPath={currentPath} viewMode={viewMode} />
			<Sidebar setViewMode={setViewMode} />
			{renderContent()}
			{renderDetails(file)}
			<Footer folderStats={folderStats} />
		</div>;
}

export default App;
