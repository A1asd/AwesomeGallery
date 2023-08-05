function Header(props) {
	function getPathName(folders, array) {
		let names = [];
		for (let i = 0; i < array.length; i++) {
			names.push(folders.folders[array[i]].name);
			folders = folders.folders[array[i]];
		}
		return names.join('/');
	}

	return <section id="header">Gallery://{getPathName(props.folderStructure, props.currentPath)}</section>
}

export default Header;
