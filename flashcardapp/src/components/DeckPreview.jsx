import '@material/web/button/filled-button.js';
import { statistics, calculateScore } from '../data.jsx';

import { Card } from './Card.jsx';

import './DeckPreview.css';

export function DeckPreview(props) {
    const stats = props.showStats && statistics.value[props.deck.id] || null;

    return (
        <Card>
            <div class="deck-preview-title">{ props.deck.title }</div>
            <div class="deck-preview-subtitle">{ props.deck.description }</div>
            <p>{ props.deck.category }</p>
            
            { stats &&
              <div>
                  <p> { stats.repetions } </p>
                  <p> There are { stats.sideAStartError.length } cards in this deck</p>
                  <p> Your score for this deck is { calculateScore(stats).toFixed(2) } </p>
                  <p> You spent average { stats.timeStats[1]  } seconds per card ind this deck</p>
                  <p> You visited this deck { (new Date(stats.lastUpdate)).toDateString() } </p>
              </div>
            }

            <md-filled-button href={`/round/${props.deck.id}?cards=20`}>Start</md-filled-button>
        </Card>
    );
}

export function DeckPreviewList(props) {
    return (
        <div>
            { props.decks.value.map((deck, index) => {
                return (
                    <DeckPreview deck={deck} showStats={props.showStats}/>
                );
            })}
        </div>
    );
}
