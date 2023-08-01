import Tags from '../Services/TagManager';

function Tag(props) {
	return <div className="tag">{Tags.getName(props.tag)} ({Tags.getCount(props.tag)})</div>
}

export default Tag;
