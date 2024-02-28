import closeButtonImage from '../../../assets/close.svg';
import pipButtonImage from '../../../assets/pip.svg';
import minimizeButtonImage from '../../../assets/minimize.svg';
/*
use these when implementing
<img src={minimizeButtonImage} onClick={() => minimizeFunction()} />
<img src={pipButtonImage} onClick={() => pipFunction()} />
*/

export default function WindowControls({closeFunction, pipFunction, minimizeFunction}) {
	return <div className={"window-controls"}>
		<img src={closeButtonImage} onClick={() => closeFunction()} />
	</div>
}
