import Tags from '../Services/TagManager';

function Tag(props) {
	return <div className="tag">{props.tag.name} ({Tags.getCount(props.tag)})</div>
}

export default Tag;
