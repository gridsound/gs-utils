"use strict";

function GSUjsonCopy( o ) {
	return JSON.parse( JSON.stringify( o ) );
}

function GSUdiffObjects( a, b ) {
	let empty = true;
	const diff = Object.entries( b ).reduce( ( diff, [ bk, bv ] ) => {
		const av = a[ bk ];
		const newval = av === bv ? undefined :
			typeof bv !== "object" || bv === null ? bv :
			typeof av !== "object" || av === null
				? Object.freeze( GSUjsonCopy( bv ) )
				: GSUdiffObjects( av, bv );

		if ( newval !== undefined ) {
			empty = false;
			diff[ bk ] = newval;
		}
		return diff;
	}, {} );

	Object.keys( a ).forEach( ak => {
		if ( !( ak in b ) ) {
			empty = false;
			diff[ ak ] = undefined;
		}
	} );
	return empty ? undefined : Object.freeze( diff );
}
