import { useEffect, useState } from "react";
import FileElement from "./FileElement";
import foldersImage from "../../assets/img/folders.svg";

function GalleryView({setFile, setViewerFile, curFolder, setCurFolder, detailsVisible}) {
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
				<img className="thumbnail" src={foldersImage} alt="a" />
				<span>{gallery.name}</span>
			</div>
		)}
		{content.map((file) =>
			<FileElement file={file} setFile={setFile} setViewerFile={setViewerFile} />
		)}
	</section>
}

export default GalleryView;
