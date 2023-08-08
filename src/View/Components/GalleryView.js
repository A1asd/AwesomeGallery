import { useEffect, useState } from "react";

function GalleryView(props) {
	const [galleries, setGalleries] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			setGalleries(await window.myAPI.getGalleries());
		}
		fetchData();
	}, [setGalleries]);

	return <section id="content">
		{galleries.map((gallery) => <div class="folder">
			<img className="thumbnail" src="./img/folders.svg" alt="a" />
			<span>{gallery.name}</span>
		</div>)}
	</section>
}

export default GalleryView;
