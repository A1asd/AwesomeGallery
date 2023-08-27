import addFolder from '../../assets/img/addfolder.svg';

function FolderSelector({resetDirs}) {
	return <div className="folder"
			onClick={async () => {
				await window.myAPI.openFile();
				resetDirs();
			}}>
			<img className="thumbnail" src={addFolder} alt="add folder" />
			<span className="">Add new Source</span>
		</div>
}

export default FolderSelector;
