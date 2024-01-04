import '@material/web/button/filled-button.js';
import '@material/web/divider/divider.js';

import { DeckPreviewList } from '../components/DeckPreview.jsx';
import { deckDescriptors } from '../data.jsx';

function Resource(props) {
    return (
        <p>
	    <h3>{ props.title }</h3>
            <p>{ props.description }</p>
            { props.children }
        </p>
    );
}

function Upload(props) {
    return (
    	<div class="upload">
            <md-filled-button>upload</md-filled-button>
        </div>   
    );
}

export function Overview() {
    return (	
        <div>
	    <h1>Flashcards</h1>
            <p>Effective learning using strategic flashards</p>
            <md-divider/>
	    <section>
		<Resource
		    title="Recent decks"
		    description="Redo one of your most recent card decks lernt below."
		>
                    <DeckPreviewList decks={deckDescriptors} showStats/>
                </Resource>
                <md-divider />
		<Resource
		    title="Import"
		    description="Import and run a card deck by uploading a json file, either by drag and drop a file here or via upload button below."
		>
                <Upload />
                    
                </Resource> 
	
	    </section>
	</div>
    );
}
