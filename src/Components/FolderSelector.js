function FolderSelector(props) {
	return <input type="button" value="+"
		onClick={async () => {
			let result = await window.myAPI.openFile();
			props.changeCurrentDirs(result.parent, result.folders, result.files, result.absolute);
		}}
		/>
}

export default FolderSelector;
