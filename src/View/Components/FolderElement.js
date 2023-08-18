import { useEffect, useState } from 'react';
import folderFront from '../../assets/img/fullfoldersfront.svg';
import backSVG from '../../assets/img/back.svg';

function FolderElement({type, folderElement, customFunc, folder, setFile}) {
	const [previewImages, setPreviewImage] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			/* TODO: hier hat er manchmal ein problem mit folder.id, cannot read id of undefined, klappt aber frontendseitig */
			if (type !== 'back') {
				let files = await window.myAPI.getFilesByFolder(folder.id);
				setPreviewImage(files.slice(0,4));
			}
		}
		fetchData();
	}, [type, setPreviewImage, folder]);

	function handleClickEvent(e) {
		switch (e.detail) {
			case 1:
				//console.log('selecting folder: ' + folder)
				if (type !== 'back')
					setFile([folder, 'folder']);
				break;
			case 2:
				customFunc()
				//window.myAPI.saveFolderToCollection(props.folderId)
				break;
			default:
		}
	} //onClick={handleClickEvent}

	if (type === 'back') {
		return <div className="folder" onClick={(e) => handleClickEvent(e)}>
			<img className="thumbnail" src={backSVG} alt="folder" />   
			<span className="folder-title">{folderElement}</span>
		</div>
	}

	return <div className="folder" onClick={(e) => handleClickEvent(e)}>
		<div className="folder-wrapper full">
			<img class="folder-wrapper-front" src={folderFront} alt="alt text" />
			{previewImages.map(previewImage => 
				<img className="folder-thumbnail" src={previewImage.path + '/' + previewImage.name} alt="folder" />
			)}
		</div>
		<span className="folder-title">{folderElement}</span>
	</div>;
}

export default FolderElement;
