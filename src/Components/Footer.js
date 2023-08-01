function Footer(props) {
	function getFolderStats(path, folders) {
		for (let i = 0; i < path.length; i++) {
			folders = folders.folders[path[i]];
		}
		return [folders.folders.length, folders.files.length];
	}

	let [ folderStats, fileStats] = getFolderStats(props.currentPath, props.folderStructure);
	return <section id="footer">{folderStats} directories - {fileStats} files</section>
}

export default Footer;
