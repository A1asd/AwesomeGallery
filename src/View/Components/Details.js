import Tag from "./Tag";
import { useState, useEffect } from 'react';

function Details({details, detailType}) {
	const [newTag, setNewTag] = useState('');
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setTags(await window.myAPI.getTags());
		}
		fetchData();
	}, [setTags]);

	function removeTag(tag) {
		window.myAPI.deleteTag(tag.name, details.id);
	}

	function enter(element) {
		if (element.key === 'Enter') window.myAPI.saveTag(newTag, details.id);
	}

	function renderRemoveSource() {
		if (!details.parent) return <input type="button" value="remove source" onClick={() => window.myAPI.deleteFolder(details.id)} />
	}

	function renderByDetailType() {
		if (detailType === 'file') {
			// TODO: total tag count ist noch ein bisschen wonky. könnte man vllt in den datenbanken verbessern
			return <div><div>{details.name}</div>
					<img id="details-image" src={details.path+ '/' + details.name} alt={details.name}/>
					{details.tags.map((tag, index) =>
						<Tag
							key={index}
							tag={tag}
							count={tags.filter(t => t.tag === tag.name)[0]}
							removeTag={removeTag} />
					)}
					<input type="text" value={newTag} onChange={(event) => {setNewTag(event.target.value)}} onKeyDown={(event) => {enter(event)}} />
					<input type="button" value="+" onClick={() => {window.myAPI.saveTag(newTag, details.id)}} />
					{tags.filter(tag => tag.tag.includes(newTag)).map(tag => {
						if (newTag)	return <div onClick={() => {window.myAPI.saveTag(tag.tag, details.id)}}>{tag.tag}</div>
						return ''
					})}
				</div>
		} else if (detailType === 'folder') {
			return <div><div>{details.name}</div>
					<input type="text" value={newTag} onChange={(event) => {setNewTag(event.target.value)}} onKeyDown={(event) => {enter(event)}} />
					<input type="button" value="add tag to folder content" onClick={() => {window.myAPI.getFilesByFolder(details.id).then(files => files.forEach(file => window.myAPI.saveTag(newTag, file.id)))}} />
					{renderRemoveSource()}
				</div>
		}
	}

	return <section id="details">
		{renderByDetailType()}
	</section>
}

export default Details;