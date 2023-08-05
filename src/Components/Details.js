import Tag from "./Tag";
import { useState, useEffect } from 'react';

function Details(props) {
	const [newTag, setNewTag] = useState('');
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setTags(await window.myAPI.getTags());
		}
		fetchData();
	}, [setTags]);

	function removeTag(tag) {
		console.log('removing tag ' + tag.name + ' from ' + file.id);
		window.myAPI.deleteTag(tag.name, file.id);
	}

	var file = props.details;
	return <section id="details">
			<div>{file.name}</div>
			<img id="details-image" src={file.path+ '/' + file.name} alt={file.name}/>
			{file.tags.map((tag, index) => <Tag key={index} tag={tag} count={tags.filter(function (el) {return el.tag === tag.name})[0]} removeTag={removeTag} />)}
			<input type="text" value={newTag} onChange={(event) => {setNewTag(event.target.value)}} />
			<input type="button" value="+" onClick={() => {window.myAPI.saveTag(newTag, file.id)}} />
		</section>
}

export default Details;