import { useState } from "react";

function TagSelector({details, tags, saveFunction, addLabel = '+'}) {
	const [newTag, setNewTag] = useState('');

	function enter(element) {
		if (element.key === 'Enter') window.myAPI.saveTag(newTag, details.id);
	}

	return <div className="tag-search">
		<input className="tag-search-input" type="text" value={newTag} onChange={(event) => {setNewTag(event.target.value)}} onKeyDown={(event) => {enter(event)}} />
		<input className="tag-search-add" type="button" value={addLabel} onClick={() => {saveFunction(newTag, details.id)}} />
		<div class="tag-list">
			{tags.filter(tag => 
				tag.tag.includes(newTag)).map(tag => {
				if (newTag && details.tags)	return <div className={details.tags.filter(t => t.name === tag.tag).length > 0 ? 'used' : ''} onClick={() => {saveFunction(tag.tag, details.id)}}>{tag.tag}</div>
				else if (newTag) return <div onClick={() => {saveFunction(tag.tag, details.id)}}>{tag.tag}</div>
				return ''
			})}
		</div>
	</div>
}

export default TagSelector;
