"use strict";

function GSUnoop() {}
function GSUnoopFalse() { return false; }

// .............................................................................
function GSUsetTimeout( fn, sec ) {
	const ms = sec * 1000 | 0;

	return ms
		? setTimeout( fn, ms )
		: ( fn(), null );
}

function GSUsetInterval( fn, sec ) {
	return setInterval( fn, sec * 1000 | 0 );
}

function GSUclearTimeout( id ) { clearTimeout( id ); }
function GSUclearInterval( id ) { clearInterval( id ); }

// .............................................................................
function GSUdebounce( fn, ms ) {
	let timeoutId;

	return ( ...args ) => {
		clearTimeout( timeoutId );
		return timeoutId = setTimeout( () => fn( ...args ), ms );
	};
}

function GSUthrottle( fn, ms ) {
	let timeoutId;
	let argsSaved;

	return ( ...args ) => {
		argsSaved = args;
		if ( !timeoutId ) {
			timeoutId = setTimeout( () => {
				fn( ...argsSaved );
				timeoutId = null;
			}, ms );
		}
		return timeoutId;
	};
}
