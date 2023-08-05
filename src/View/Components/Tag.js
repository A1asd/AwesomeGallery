function Tag(props) {
	console.log(props.count)
	return <div className="tag">{props.tag.name} ()<input type="button" value="-" onClick={() => {props.removeTag(props.tag)}} /></div>
}

export default Tag;
