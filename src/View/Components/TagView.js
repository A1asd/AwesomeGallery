import { useEffect, useState } from "react";
import FileElement from "./FileElement";

function TagView({setFile}) {
	const [tags, setTags] = useState([]);
	const [currentFiles, setCurrentFiles] = useState([]);
	const [tagFilter, setTagFilter] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setTags(await window.myAPI.getTags());
			if (tagFilter.length > 0)
				setCurrentFiles(await window.myAPI.getFilesByTags(tagFilter))
			else
				setCurrentFiles(await window.myAPI.getFiles());
		}
		fetchData();
	}, [setTags, setCurrentFiles, tagFilter]);

	function toggleTagFilter(tag) {
		let tagFilterCopy = tagFilter.slice();
		if (tagFilterCopy.includes(tag))
			tagFilterCopy.splice(tagFilterCopy.indexOf(tag), 1)
		else
			tagFilterCopy.push(tag);
		setTagFilter(tagFilterCopy);
	}

	return <section id="content">
		<div class="tags">
		{tags.map((tag) => {
				let className = 'tag';
				if (tagFilter.includes(tag.tag)) {
					className += ' active';
				}
			return <div className={className} onClick={() => toggleTagFilter(tag.tag)}>
			<img className="thumbnail" src="./img/tags.svg" alt="a" />
			<span>{tag.tag} ({tag.total})</span>
			</div>
		})}
		</div>
		<div class="files">
		{currentFiles.map(file =>
			<FileElement setFile={setFile} file_element={file} />
		)}
		</div>
	</section>
}

export default TagView;