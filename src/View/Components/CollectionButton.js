import { useState } from "react";

function CollectionButton({setView, collection}) {
	const [collectionLabel, setCollectionLabel] = useState(collection.label ?? collection.viewmode);
	const [editing, setEditing] = useState(false);

	function saveCollection() {
		setEditing(false);
		collection.label = collectionLabel;
		window.myAPI.updateCollection(collection);
	}

	function deleteCollection() {
		setEditing(false);
		window.myAPI.deleteCollection(collection);
	}

	return <>
		{!editing?
			<div>
				<span class='collectionButton' style={{maxWidth:'60%'}} onClick={() => setView(collection)}>{collectionLabel ?? collection.viewmode} ({collection.id})</span>
				<input type="button" onClick={() => setEditing(true)} value="e"/>
			</div>
			:
			<div>
				<input type="text" style={{width: '60%'}} value={collectionLabel} onChange={(event) => setCollectionLabel(event.target.value)} />
				<input type="button" onClick={() => saveCollection()} value="s"/>
				<input type="button" onClick={() => deleteCollection()} value="d"/>
			</div>
		}
	</>
}

export default CollectionButton;
