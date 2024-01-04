import './styles.css';

import { render } from 'preact';
import { LocationProvider, Router, Route} from 'preact-iso';

import { Overview } from './pages/Overview.jsx';
import { Round } from './pages/Round.jsx';
import { NotFound } from './pages/_404.jsx';

import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";
const theme = themeFromSourceColor(argbFromHex('#e0e0ff'), [
    {
        name: "custom-1",
        value: argbFromHex("#ff0000"),
        blend: true,
    },
]);

// Check if the user has dark mode turned on
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply the theme to the body by updating custom properties for material tokens
applyTheme(theme, {target: document.body, dark: systemDark});



export function App() {
    return (
	<LocationProvider>
	    <main>
		<Router>
                    <Route path="/" component={ Overview } />
                    <Route path="/round/:deckId" component={ Round } />
		    <Route default component={ NotFound } />
		</Router>
	    </main>
	</LocationProvider>
    );
}

render(<App />, document.getElementById('app'));
