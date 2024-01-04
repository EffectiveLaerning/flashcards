import { useEffect, useState } from 'preact/hooks';
import { loadDeck, getNextCardFromDeck } from '../data.jsx';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';

import { Card } from '../components/Card.jsx';

import './Round.css'

export function Round(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [deck, setDeck] = useState(null);
    const [error, setError] = useState(null);
    const [card, setCard] = useState(null);
    const [isRating, setIsRating] = useState(null);
    const [counter, setCounter] = useState(props.query && props.query.cards || 10);

    const getNextCard = () => {
        const index = getNextCardFromDeck(deck.stats, card && card.index || null);
        const nextCard = deck.deck.deck[index % deck.deck.deck.length];
        const reverse = index < deck.stats.sideAStartError.length ? true : false;
              
        setCard({
            index,
            reverse,
            card: nextCard
        });
    }

    const updateErrorStats = (failed) => {
        const newStats = { ...deck.stats };

        const index = card.index % deck.deck.deck.length;
        const deltaError = failed ? 1 : -0.5;
        if (card.reverse) {
            newStats.sideBStartError[index] += deltaError;
            newStats.sideBStartError[index] = Math.max(0,  newStats.sideBStartError[index]);
        } else {
            newStats.sideAStartError[index] += deltaError
            newStats.sideAStartError[index] = Math.max(0,  newStats.sideAStartError[index]);
        }

        newStats.lastUpdate = Date.now();
        if (deck.stats.lastUpdate != 0) {
            const timeSpentSecs = (newStats.lastUpdate - deck.stats.lastUpdate) / 1000;
            newStats.timeStats[0] = Math.min(newStats.timeStats[0], timeSpentSecs);
            newStats.timeStats[1] = (newStats.timeStats[1] + timeSpentSecs) / 2.0;
            newStats.timeStats[2] = Math.max(newStats.timeStats[2], timeSpentSecs);
        }
        
        newStats.repetitions++;

        console.log(newStats);
        setIsRating(false);
        setCounter(counter - 1);
        setDeck({
            ...deck,
            stats: newStats
        });
    }

    useEffect(() => {
        if (deck != null)
            return;
        setIsLoading(false);
        setDeck(loadDeck(props.deckId));
    }, []);

    useEffect(() => {
        if (isLoading)
            return;

        if (deck == null) {
            setError(`Failed to load card deck with id ${props.deckId} from local storage.`);
            return
        }

        getNextCard();
    }, [deck]);

   
    const reverse = card ? (isRating ? !card.reverse : card.reverse) : false;
 
    return (	
        <div class="container">
	    { error && error }
            { counter != 0 && card &&
              <div class="card-slot">
                  <Card onClick={ () => setIsRating(true) }>
                      <div class="side">{ reverse && card.card.sideB || card.card.sideA }</div>
                  </Card>
              </div>
            }
            { counter != 0 && isRating &&
              <div class="actionbar-slot">
                  <div class="flex-left">
                      <md-outlined-button onClick={ () => updateErrorStats(true) }>No</md-outlined-button>
                  </div>
                  <div class="flex-right">
                      <md-filled-button onClick={ () => updateErrorStats(false) }>Yes</md-filled-button>
                  </div>
              </div>
            }
            { counter == 0 &&
              <div>
                  <p>Show stats for this round</p>
                  <md-filled-button href="/">Back</md-filled-button>
              </div>
            }
	</div>
    );
}
