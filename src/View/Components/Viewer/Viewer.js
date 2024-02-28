import ViewerImage from "./ViewerImage";
import WindowControls from "./WindowControls";
import './Viewer.css';
import rightButtonImage from '../../../assets/right.svg';

export default function Viewer({startingFileNumber, setStartingFileNumber, viewingGroup, setViewingGroup}) {
	function close() {
		setViewingGroup([]);
	}

	function pip() {
		//TODO: implement picture in picture
	}

	function minimize() {
		//TODO: implement minimizing
	}

	function nextPicture() {
		let tempNumber = startingFileNumber;
		if (++tempNumber > viewingGroup.length-1) {
			tempNumber = 0;
		}
		setStartingFileNumber(tempNumber);
	}

	function prevPicture() {
		let tempNumber = startingFileNumber;
		if (--tempNumber < 0) {
			tempNumber = viewingGroup.length-1;
		}
		setStartingFileNumber(tempNumber);
	}

	if (viewingGroup.length > 0) return <div id={"viewer"}>
			<div className={"image-name"}>{viewingGroup[startingFileNumber].name}</div>
			<WindowControls closeFunction={close} pipFunction={pip} minimizeFunction={minimize} />
			<img className={"prev-image viewer-controls"} src={rightButtonImage} onClick={() => prevPicture()} />
			<ViewerImage image={viewingGroup[startingFileNumber].path + '/' + viewingGroup[startingFileNumber].name}></ViewerImage>
			<img className={"next-image viewer-controls"} src={rightButtonImage} onClick={() => nextPicture()} />
			<div className={"image-controls"}>controls</div>
		</div>
	return ''
}
