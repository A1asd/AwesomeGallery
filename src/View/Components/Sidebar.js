import { useEffect, useState } from "react";
import ViewModeManager from "../Services/ViewModeManager";

function Sidebar({setViewMode}) {
	const [collection, setCollection] = useState([]);

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

	return <section id="sidebar">
		<h3>Viewmodes</h3>
		{struct.views.map((view) => <div onClick={() => {setViewMode(view)}} >{view}</div>)}
		<h3>Collections</h3>
		{struct.collection.map((element) => <div>{element.name}</div>)}
	</section>
}

export default Sidebar;
