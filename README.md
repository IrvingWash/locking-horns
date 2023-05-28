# Locking Horns

## Description
**Locking Horns** is a small library that helps to decrease workload in a multitab browser session.  
Framework agnostic. Zero dependency. ...Not tested.

Let's say you are making a request to an endpoint every second.
A user opens four tabs (they really need that much). Now it's four requests per second. Not cool nor for the server nor for the user.

**Locking Horns** lets you avoid this issue by creating a master tab. Only the master tab will perform the resourceful action.
All the other tabs will work for the user the same, the only difference is, they now receive the data from the master tab (and not from the server)!
Moreover. If the master tab is closed, another tab automatically takes the role.

## How does it work?
It's a combination of [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) and [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

## How to install?
```console
npm i locking-horns
```

## Usage
```tsx
import {
	Horns,
	HerdHandler,
	HerdAction,
} from 'locking-horns'

export function App(): JSX.Element {
	const [name, setName] = useState<string | undefined>();

	// HerdHandler is invoked in every tab when the master tabs sends a new message.
	// This is how other tabs get data without fetching.
	// This function eventually will be set into `BroadcastChannel.onmessage`.
	const herdHandler: HerdHandler<string> = (event: MessageEvent<string>): void => {
		setName(event.data);
	};

	// HerdHandler is used to emit data from the master tab.
	// This is how the master tab sends the fetched data to the other tabs.
	const herdAction: HerdAction<string> = async(bellow: Bellow<string>) => {
		setInterval(async() => {
			const response = await fetch(`http://localhost:3000/${getRandomPokemonId()}`);
			const pokemon = await response.json();

			setName(pokemon.name);

			// Bellow is a wrapper around `BroadcastChannel.postMessage()`.
			bellow(pokemon.name);
		}, 1000);
	};

	// Horns is the object to go.
	// At this point all the preparations are done. Let's use this
	const horns = new Horns('pokemon', herdHandler, herdAction);

	// Start making request as the page loads.
	useEffect(() => {
		getPokemonName();

		return () => {
			// Release the lock when the component is unmounted
			horns.unlock();
		}
	}, []);

	return (
		<main>
			<p>I am a pokemon</p>
			<p>The name is { name ?? '...' }</p>
		</main>
	);

	async function getPokemonName(): Promise<void> {
		// Automatically select a master tab
		// and start invoking `herdAction`
		horns.lock(herdAction);
	}

	function getRandomPokemonId(): number | undefined {
		const pokemonIds = [1, 2, 3];

		return pokemonIds[Math.floor(Math.random() * pokemonIds.length)];
	}
}
```
