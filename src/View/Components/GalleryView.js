import { useEffect, useState } from "react";
import FileElement from "./FileElement";

function GalleryView({setFile, curFolder, setCurFolder, detailsVisible}) {
	const [galleries, setGalleries] = useState([]);
	const [content, setContent] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			setGalleries(await window.myAPI.getFoldersNotEmpty());
			if (curFolder) {
				setContent(await window.myAPI.getFilesByFolder(curFolder));
			}
		}
		fetchData();
	}, [setGalleries, setContent, curFolder]);

	return <section id="content" className={'gallery-view' + (!detailsVisible ? ' details-invisible' : '')}>
		{galleries.map((gallery) =>
			<div class="folder" onClick={() => setCurFolder(gallery.id)}>
				<img className="thumbnail" src="./img/folders.svg" alt="a" />
				<span>{gallery.name}</span>
			</div>
		)}
		{content.map((file) => 
			<FileElement file={file} setFile={setFile} />
		)}
	</section>
}

export default GalleryView;
