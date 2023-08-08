function FolderSelector(props) {
	return <div className="folder"
			onClick={async () => {
				let result = await window.myAPI.openFile();
				props.changeCurrentDirs(result);
			}}>
			<img className="thumbnail" src="./img/addfolder.svg" alt="add folder" />
			<span className="">Add new Source</span>
		</div>
}

export default FolderSelector;
