function Footer({folderStats}) {
	//function getFolderStats(path, folders) {
	//	for (let i = 0; i < path.length; i++) {
	//		folders = folders.folders[path[i]];
	//	}
	//	return [folders.folders.length, folders.files.length];
	//}

	//let [ folderStats, fileStats] = getFolderStats(currentPath, folderStructure);
	//return <section id="footer">{folderStats} directories - {fileStats} files</section>
	return <section id="footer">{folderStats[0]} directories - {folderStats[1]} files</section>
}

export default Footer;
