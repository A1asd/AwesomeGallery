function Tag(props) {
	return <div className="tag">{props.tag.name} ({props.count.total})<input type="button" value="-" onClick={() => {props.removeTag(props.tag)}} /></div>
}

export default Tag;
