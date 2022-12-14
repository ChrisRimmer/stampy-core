import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import useCookie from "react-use-cookie";

// This is an example custom hook
// The naming syntax is SPECIFICALLY "useSomething" for all hooks
export const useLocalStorage = (keyName: string) => {
	// We don't want to hammer localStorage continuously forever,
	//  so we use `useState` to store the last value we got from localStorage
	//  kind of like a cache, and we pre-set it to the current value of whatever
	//  localStorage key we're interested in.
	const [value, updateValue] = useState(
		JSON.parse(window.localStorage.getItem(keyName) || "null"),
	);

	// This is the function that will be called whenever localStorage updates
	const listener = (event) => {
		// Like most event handlers, this function is given an `event` object
		//  containing a whole load of stuff we don't care about, so we
		//  destructure it to extract just the `key` and `newValue` properties
		//  as these are the only things we care about.
		const { key, newValue } = event;

		// The localStorage event listener fires on every update to every key in
		//  Storage, so we check the event we've been given to see if it was for
		//  the key that this specific hook is looking for, by comparing the
		//  `key` parameter of the event to the `keyName` this hook was told to
		//  subscribe to. If (and only if!) the keys match, then we update our
		//  local state to store the new value.
		if (key == keyName) updateValue(newValue);
	};

	// Because we're binding an event listener to the `window` object, executing
	//  this hook has a long-lasting impact on the state of the browser session.
	//  Therefore this hook would be described as "having side effects" - it
	//  doesn't JUST return data, it also changes the world around it a little
	//  bit. Since all of the code in a custom hook like this runs every time
	//  the hook is called (which is roughly once per render) we need to specify
	//  to (p)React that some code, like binding the event listener, should only
	//  execute once. To do this, we wrap that code in a `useEffect` hook call,
	//  so (p)React can go "ok, this is a side effect, so I'm only going to run
	//  this once."
	useEffect(
		// The first argument to `useEffect` is a function that when called,
		//  will "do the side effect". That might be to set up a repeating
		//  series of requests to an API to regularly pull a user's
		//  notifications, or to monitor future changes to the browser window's
		//  size for the purposes of building responsive layouts etc. Roughly
		//  speaking, anything that you don't want to run every time the
		//  component renders would count as a side effect.
		() => {
			// Here is the side effect itself, binding the event listener. If we
			//  let this run every time the component rendered, we could
			//  potentially end up with hundreds or thousands of event listeners
			//  being bound which can not only cause some very strange bugs but
			//  also memory leaks and performance problems like lag or worse.
			window.addEventListener("storage", listener);

			// When using `useEffect` you can also specify how to undo the side
			//  effects. Sometimes you don't need to - if you're just doing a
			//  fetch or something there is no long-lasting effect to clean up.
			//  But here we need to tell (p)React how to remove the event
			//  listener that we bound earlier. To enable this, when calling
			//  `useEffect` we can return a function, which when called will
			//  clear up after ourselves. In this case, because we bound an
			//  event listener, we use the browser's built-in
			//  `window.removeEventListener` function to unbind our event
			//  listener. By providing (p)React with this function, it will
			//  call it for us when our side effect is no longer needed, thus
			//  ensuring we don't have memory leaks, bugs, performance problems
			//  etc caused by keeping long-lasting stuff like event handlers
			//  alive forever.
			return () => window.removeEventListener("storage", listener);
		},
		// The second argument to a `useEffect` function call is an array that
		//  contains all of the variables that should "reset" our side effect.
		//  In this case, if our hook call changes from `useLocalStorage("foo")`
		//  to `useLocalStorage("bar")`, we don't need to do anything because
		//  our side effect listens to *all* of localStorage, so we don't need
		//  to unbind it, and replace it with a new one. But you can imagine if
		//  our side effect could only detect changes to one specific key, we'd
		//  need to unbind it so we stop seeing update to "foo" and re-bind with
		//  a new listener that listens for changes to "bar". But because we
		//  don't need to do that here, we can give `useEffect` an empty array.
		//  You can think of this as basically saying explicitly "even if your
		//  inputs change, you don't need to clear the side effect and re-run"
		[],
	);

	// Just a small function that we can give back to the code that's calling
	//  our hook, to let it write new data *into* the localStorage key as well
	//  as just reading from it. This effectively makes this hook behave a lot
	//  like `useState` except that the data is persistently stored in
	//  localStorage.
	const setValue = (newValue) => {
		updateValue(newValue);
		window.localStorage.setItem(keyName, JSON.stringify(newValue));
	};

	// Finally, return an array containing the current value from the key we're
	//  watching in localStorage, and a function that the caller can use to
	//  put new data into that key.
	return [value, setValue];
};

export const useJWT = (): { type: "sa" | "ea" | "ba"; node: string } =>
	jwt_decode(useCookie("jwt")[0]);
