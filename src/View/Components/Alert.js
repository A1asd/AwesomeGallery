import ApiButton from "./ApiButton";

function Alert({alert, removeAlert}) {
	function renderApiButton() {
		if (alert.linkLabel) return <ApiButton removeAlert={removeAlert} apiFunction={alert.link} linkLabel={alert.linkLabel}></ApiButton>
	}

	return <div class={"alert " + alert.type} onAnimationEnd={(event) => {if (event.animationName === 'shrink') removeAlert()}}>
			<div>
				<span>{alert.label}</span>
				{renderApiButton()}
			</div>
			<button onClick={(event) => event.target.parentNode.classList.add('hide')}>x</button>
		</div>;
}

export default Alert;
