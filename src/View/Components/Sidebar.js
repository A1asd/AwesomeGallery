function Sidebar() {
	const struct = {
		views: ['Gallerie', 'Tags', 'Folders'],
		collections: [],
	}
	return <section id="sidebar">
		<h3>Viewmodes</h3>
		{struct.views.map((view) => <div>{view}</div>)}
		<h3>Collections</h3>
		{struct.collections.map((element) => <div>{element}</div>)}
	</section>
}

export default Sidebar;
