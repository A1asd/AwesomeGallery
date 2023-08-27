import { useEffect, useState } from "react";
import FileElement from "./FileElement";
import tagImage from '../../assets/img/tags.svg';

function TagView({setFile, tagFilter, setTagFilter, detailsVisible}) {
	const [tags, setTags] = useState([]);
	const [currentFiles, setCurrentFiles] = useState([]);

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

	return <section id="content" className={'tag-view' + (!detailsVisible ? ' details-invisible' : '')}>
		<div class="tags">
		{tags.sort((b,a) => {if (tagFilter.includes(a.tag)) {return 1} else {return -1}}).map((tag) => {
			let className = 'tag-view-tag';
			if (tagFilter.includes(tag.tag)) {
				className += ' active';
			}
			return <div className={className} onClick={() => toggleTagFilter(tag.tag)}>
				<img className="thumbnail" src={tagImage} alt="a" />
				<span>{tag.tag} ({tag.total})</span>
			</div>
		})}
		</div>
		{currentFiles.map(file =>
			<FileElement setFile={setFile} file={file} />
		)}
	</section>
}

export default TagView;
