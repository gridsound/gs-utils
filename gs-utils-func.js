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
	const ms = sec * 1000 | 0;

	if ( ms ) {
		return setInterval( fn, ms );
	}

	const obj = Object.seal( { $id: null } );
	const fn2 = () => {
		fn();
		obj.$id = requestAnimationFrame( fn2 );
	};

	fn2();
	return obj;
}

function GSUclearTimeout( id ) {
	clearTimeout( id );
}

function GSUclearInterval( id ) {
	GSUisObj( id )
		? cancelAnimationFrame( id.$id )
		: clearInterval( id );
}

// .............................................................................
function GSUdebounce( fn, sec ) {
	let timeoutId;

	return ( ...args ) => {
		GSUclearTimeout( timeoutId );
		return timeoutId = GSUsetTimeout( () => fn( ...args ), sec );
	};
}

function GSUthrottle( fn, sec ) {
	let timeoutId;
	let argsSaved;

	return ( ...args ) => {
		argsSaved = args;
		if ( !timeoutId ) {
			timeoutId = GSUsetTimeout( () => {
				fn( ...argsSaved );
				timeoutId = null;
			}, sec );
		}
		return timeoutId;
	};
}
