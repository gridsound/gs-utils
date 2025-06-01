"use strict";

function GSUnoop() {}
function GSUnoopFalse() { return false; }

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
