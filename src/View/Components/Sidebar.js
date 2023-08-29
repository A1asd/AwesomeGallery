import { useEffect, useState } from "react";
import ViewModeManager from "../Services/ViewModeManager";
import folders from "../../assets/img/folders.svg";
import tags from "../../assets/img/tags.svg";
import files from "../../assets/img/images.svg";

function Sidebar({setViewMode, addCurrentViewToCollection}) {
	const [collection, setCollection] = useState([]);
	const [newCollectionName, setNewCollectionName] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			setCollection(await window.myAPI.getCollection());
		}
		fetchData();
	}, [setCollection])

	const struct = {
		views: ViewModeManager.VIEWMODES,
		collection: collection,
	}

	function getViewIcon(viewMode) {
		if (viewMode === ViewModeManager.FOLDER) {
			return folders;
		} else if (viewMode === ViewModeManager.TAGS) {
			return tags;
		} else if (viewMode === ViewModeManager.GALLERY) {
			return files;
		}
	}

	return <section id="sidebar">
		<h3>Workspaces (Viewmodes)</h3>
		{struct.views.map((view) => 
			<div onClick={() => {setViewMode(view)}} >
				<img className="sidebar-icon" src={getViewIcon(view)} alt="alt text"/>
				<span>{view}</span>
			</div>
		)}
		<h3>Saves (Collections)</h3>
		<input type="text" value={newCollectionName} />
		<input type="button" value="+" onClick={() => addCurrentViewToCollection(newCollectionName)}/>
		{struct.collection.map((element) => <div>{element.name}</div>)}
	</section>
}

export default Sidebar;
