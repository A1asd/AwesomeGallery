function Tag(props) {
	return <div className="tag">{props.tag.name} ({props.count.total})</div>
}

export default Tag;
