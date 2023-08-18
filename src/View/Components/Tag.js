function Tag({tag, count, removeTag}) {
	if (count) count = count.total
	return <div className="tag">
		{tag.name}
		<input type="button" value="-" onClick={() => {removeTag(tag)}} />
	</div>
}

export default Tag;
