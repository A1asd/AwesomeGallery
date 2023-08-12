function Header({currentPath, viewMode}) {
	let path = currentPath.map(p => p[1])

	return <section id="header">Gallery://{path.join('/')}</section>
}

export default Header;
