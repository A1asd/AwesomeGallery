import { useEffect, useState } from "react";

function TagView(props) {
	const [tags, setTags] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			setTags(await window.myAPI.getTags());
		}
		fetchData();
	}, [setTags]);

	return <section id="content">
		{tags.map((tag) => <div class="folder">
			<img className="thumbnail" src="./img/tags.svg" alt="a" />
			<span>{tag.tag} ({tag.total})</span>
		</div>)}
	</section>
}

export default TagView;
