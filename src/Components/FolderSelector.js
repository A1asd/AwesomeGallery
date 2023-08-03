function FolderSelector(props) {
	return <input type="button" value="+"
		onClick={async () => {
			let result = await window.myAPI.openFile();
			props.changeCurrentDirs(result);
		}}
		/>
}

export default FolderSelector;
