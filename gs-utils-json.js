"use strict";

function GSUgetNewId( obj ) {
	___( obj, "object" );
	let i = 0;

	for ( ; i in obj; ++i ) {}
	return `${ i }`;
}

function GSUjsonCopy( o ) {
	return JSON.parse( JSON.stringify( o ) );
}

function GSUdeepCopy( obj ) {
	if ( GSUisObj( obj ) ) {
		return Object.entries( obj ).reduce( ( cpy, [ k, v ] ) => {
			cpy[ k ] = GSUdeepCopy( v );
			return cpy;
		}, {} );
	}
	return obj;
}

function GSUdeepAssign( a, b ) {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( !GSUisObj( val ) ) {
				a[ k ] = val;
			} else if ( !GSUisObj( a[ k ] ) ) {
				a[ k ] = GSUdeepCopy( val );
			} else {
				GSUdeepAssign( a[ k ], val );
			}
		} );
	}
	return a;
}

function GSUdeepFreeze( obj ) {
	if ( GSUisObj( obj ) ) {
		Object.freeze( obj );
		Object.values( obj ).forEach( GSUdeepFreeze );
	}
	return obj;
}

function GSUdiffObjects( a, b ) {
	let empty = true;
	const diff = Object.entries( b ).reduce( ( diff, [ bk, bv ] ) => {
		const av = a[ bk ];
		const newval = av === bv ? undefined :
			typeof bv !== "object" || bv === null ? bv :
			typeof av !== "object" || av === null
				? GSUjsonCopy( bv )
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
	return empty ? undefined : diff;
}

function GSUdiffAssign( a, b ) {
	if ( b ) {
		Object.entries( b ).forEach( ( [ k, val ] ) => {
			if ( a[ k ] !== val ) {
				if ( val === undefined ) {
					delete a[ k ];
				} else if ( !GSUisObj( val ) ) {
					a[ k ] = val;
				} else if ( !GSUisObj( a[ k ] ) ) {
					a[ k ] = GSUjsonCopy( val );
				} else {
					GSUdiffAssign( a[ k ], val );
				}
			}
		} );
	}
	return a;
}

function GSUaddIfNotEmpty( obj, attr, valObj ) {
	if ( !GSUisEmpty( valObj ) ) {
		if ( attr in obj ) {
			GSUdeepAssign( obj[ attr ], valObj );
		} else {
			obj[ attr ] = valObj;
		}
	}
	return obj;
}

function GSUcomposeUndo( data, redo ) {
	if ( GSUisObj( data ) && GSUisObj( redo ) ) {
		return Object.freeze( Object.entries( redo ).reduce( ( undo, [ k, val ] ) => {
			if ( data[ k ] !== val ) {
				undo[ k ] = GSUcomposeUndo( data[ k ], val );
			}
			return undo;
		}, {} ) );
	}
	return data;
}

function GSUcreateUpdateDelete( dataSrc, fnCreate, fnUpdate, fnDelete, dataChange ) {
	if ( dataChange ) {
		Object.entries( dataChange ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				if ( id in dataSrc ) {
					fnDelete( id, dataChange );
				}
			} else if ( id in dataSrc ) {
				fnUpdate( id, obj, dataChange );
			} else {
				fnCreate( id, obj, dataChange );
			}
		} );
	}
}
