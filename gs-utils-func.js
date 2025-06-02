"use strict";

function GSUnoop() {}
function GSUnoopFalse() { return false; }

// .............................................................................
function GSUsetTimeout( fn, sec ) {
	___( fn, "function" );
	___( sec, "number-positive-0" );
	const ms = sec * 1000 | 0;

	return ms
		? setTimeout( fn, ms )
		: ( fn(), null );
}

let _GSUsetInterval_minMs = 0;

function GSUsetIntervalLimit( sec ) {
	___( sec, "number-positive-0" );
	return _GSUsetInterval_minMs = sec * 1000 | 0;
}

function GSUsetInterval( fn, sec ) {
	___( fn, "function" );
	___( sec, "number-positive-0" );
	const ms = Math.max( _GSUsetInterval_minMs, sec * 1000 | 0 );

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
	___( fn, "function" );
	___( sec, "number-positive" );
	let timeoutId;

	return ( ...args ) => {
		GSUclearTimeout( timeoutId );
		return timeoutId = GSUsetTimeout( () => fn( ...args ), sec );
	};
}

function GSUthrottle( fn, sec ) {
	___( fn, "function" );
	___( sec, "number-positive" );
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
