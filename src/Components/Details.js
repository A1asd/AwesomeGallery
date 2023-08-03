import Tag from "./Tag";

function Details(props) {
	var file = props.details;
	return <section id="details">
			<div>{file.name}</div>
			<img id="details-image" src={file.absolute + '/' + file.name} alt={file.name}/>
			{file.tags.map((tag, index) => <Tag key={index} tag={tag} />)}
		</section>
}

export default Details;