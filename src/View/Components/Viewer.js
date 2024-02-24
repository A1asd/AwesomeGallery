import ViewerControls from "./ViewerControls";
import ViewerImage from "./ViewerImage";

export default function Viewer({file}) {
	return
	if (file && file[1] === 'file')
	return <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.5)', position: 'absolute', zIndex: '100'}}>
		<ViewerImage image={file[0].path + '/' + file[0].name}></ViewerImage>
		<ViewerControls></ViewerControls>
	</div>
}
