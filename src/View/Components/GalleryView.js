import { useEffect, useState } from "react";

function GalleryView() {
	const [galleries, setGalleries] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			setGalleries(await window.myAPI.getFoldersNotEmpty());
		}
		fetchData();
	}, [setGalleries]);

	return <section id="content">
		{galleries.map((gallery) => <div class="folder" onClick={() => setGalleries(window.myAPI.getFilesByFolder(gallery.id))}>
			<img className="thumbnail" src="./img/folders.svg" alt="a" />
			<span>{gallery.name}</span>
		</div>)}
	</section>
}

export default GalleryView;
