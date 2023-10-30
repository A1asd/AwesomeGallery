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
			<>
				<div class='collectionButton' onClick={() => setView(collection)}>{collectionLabel ?? collection.viewmode} ({collection.id})</div>
				<input type="button" onClick={() => setEditing(true)} value="e"/>
			</>
			:
			<>
				<input type="text" style={{width: '60%'}} value={collectionLabel} onChange={(event) => setCollectionLabel(event.target.value)} />
				<input type="button" onClick={() => saveCollection()} value="s"/>
				<input type="button" onClick={() => deleteCollection()} value="d"/>
			</>
		}
	</>
}

export default CollectionButton;
