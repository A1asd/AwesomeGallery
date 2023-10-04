function Header({currentPath, setCurrentPath, viewMode}) {
	console.log(currentPath)
	//let path = currentPath.map(p => p[1])

	function setPathToIndex(index) {
		let newPathArray = [];
		for (let i = 0; i < index + 1; i++) newPathArray.push(currentPath[i]);
		setCurrentPath(newPathArray);
	}

	return <section id="header">
		<span onClick={() => setCurrentPath([])}>Gallery</span>://{currentPath.map((p, index) => {
			return <span onClick={() => setPathToIndex(index)}>{p[1]}/</span>;
		})}
	</section>
}

export default Header;
