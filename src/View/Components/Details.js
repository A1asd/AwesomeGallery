import Tag from "./Tag";
import { useState, useEffect } from 'react';
import TagSelector from "./TagSelector";
import folderImage from "../../assets/img/folders.svg";

function Details({details, detailType, setFile}) {
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

	function renderRemoveSource() {
		if (!details.parent) return <input
			type="button"
			value="remove source"
			onClick={() => window.myAPI.deleteFolder(details.id)} />
	}

	function renderByDetailType() {
		if (detailType === 'file') {
			// TODO: total tag count ist noch ein bisschen wonky. könnte man vllt in den datenbanken verbessern
			return <div>
				<div>{details.name}</div>
				<img id="details-image" src={details.path+ '/' + details.name} alt={details.name}/>
				<div class="tag-wrapper">
				{details.tags.map((tag, index) =>
					<Tag
						key={index}
						tag={tag}
						count={tags.filter(t => t.tag === tag.name)[0]}
						removeTag={removeTag} />
				)}
				<TagSelector
					details={details}
					tags={tags}
					saveFunction={(t, f) => {
						window.myAPI.saveTag(t, f)}} />
				</div>
				<span>{details.path}</span>
			</div>
		} else if (detailType === 'folder') {
			return <div>
				<div>{details.name}</div>
				<img id="details-image" src={folderImage} alt={details.name}/>
				<div class="tag-wrapper">
				<TagSelector
					details={details}
					tags={tags}
					addLabel='add tag to folder'
					saveFunction={(t, f) => window.myAPI.getFilesByFolder(f).then(files => files.forEach(file => 
						window.myAPI.saveTag(t, file.id)))} />
				</div>
				{renderRemoveSource()}
				<span>{details.path}</span>
			</div>
		}
	}

	return <section id="details">
		<input type="button" onClick={() => setFile(null)} value=">>" />
		{renderByDetailType()}
	</section>
}

export default Details;
