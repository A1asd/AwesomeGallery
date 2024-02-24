import { useState } from 'react';

export default function Search({}) {
	const [searchText, setSearchText] = useState('');
	const [searchedInputs, setSearchedInputs] = useState(['blub','flup']);

	function handleKeyEvent(event) {
		if (event.code !== 'Enter') return;
		let newSearches = searchedInputs.slice();
		newSearches.push(searchText);
		setSearchText('');
		setSearchedInputs(newSearches);
	}

	return <div id="search" style={{display:'inline-block',padding:'3px',borderRadius:'12px',border:'1px solid grey', margin:'2px', background:'rgba(0,0,0,.1)'}}>
		{searchedInputs.map((input) => {
			return <span style={{background:'rgba(255,255,255,.1)',borderRadius:'15px',padding:'7px',marginRight:'5px'}}>{input}</span>
		})}
		<input style={{background: 'none',border:'1px solid grey'}} type="text" onChange={(event) => setSearchText(event.target.value)} onKeyUp={(event) => handleKeyEvent(event)} value={searchText} />
	</div>
}