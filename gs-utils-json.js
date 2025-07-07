"use strict";

function GSUgetNewId( obj ) {
	___( obj, "object" );
	let i = 0;

	for ( ; i in obj; ++i ) {}
	return `${ i }`;
}

function GSUgetNewIds( obj, nb ) {
	___( obj, "object" );
	___( nb, "integer-positive" );
	const ids = [];
	let i = 0;

	for ( ; ids.length < nb; ++i ) {
		if ( !( i in obj ) ) {
			ids.push( `${ i }` );
		}
	}
	return ids;
}

function GSUgetLastOrder( obj ) {
	___( obj, "objay" );
	return GSUreduce( obj, ( max, item ) => Math.max( max, item.order || 0 ), -1 ) + 1;
}

function GSUjsonCopy( o ) {
	return JSON.parse( JSON.stringify( o ) );
}

function GSUdeepCopy( obj ) {
	return !GSUisObj( obj )
		? obj
		: GSUreduce( obj, ( cpy, v, k ) => {
			if ( GSUisArr( cpy ) ) {
				cpy.push( GSUdeepCopy( v ) );
			} else {
				cpy[ k ] = GSUdeepCopy( v );
			}
			return cpy;
		}, GSUisArr( obj ) ? [] : {} );
}

function GSUdeepAssign( a, b ) {
	GSUforEach( b, ( val, k ) => {
		if ( !GSUisObj( val ) ) {
			a[ k ] = val;
		} else if ( !GSUisObj( a[ k ] ) ) {
			a[ k ] = GSUdeepCopy( val );
		} else {
			GSUdeepAssign( a[ k ], val );
		}
	} );
	return a;
}

function GSUdeepFreeze( obj ) {
	if ( GSUisObj( obj ) ) {
		Object.freeze( obj );
		GSUforEach( obj, GSUdeepFreeze );
	}
	return obj;
}

function GSUdiffObjects( a, b ) {
	let empty = true;
	const diff = GSUreduce( b, ( diff, bv, bk ) => {
		const av = a[ bk ];
		const newval = av === bv ? undefined :
			!GSUisObj( bv ) ? bv :
			!GSUisObj( av ) || ( GSUisArr( bv ) && GSUisArr( av ) && !GSUarrayEq( av, bv ) )
				? GSUdeepCopy( bv )
				: GSUdiffObjects( av, bv );

		if ( newval !== undefined ) {
			empty = false;
			diff[ bk ] = newval;
		}
		return diff;
	}, {} );

	GSUforEach( a, ( _, ak ) => {
		if ( !( ak in b ) ) {
			empty = false;
			diff[ ak ] = undefined;
		}
	} );
	return empty ? undefined : diff;
}

function GSUdiffAssign( a, b ) {
	GSUforEach( b, ( val, k ) => {
		if ( a[ k ] !== val ) {
			if ( val === undefined ) {
				delete a[ k ];
			} else if ( !GSUisObj( val ) ) {
				a[ k ] = val;
			} else if ( !GSUisObj( a[ k ] ) || GSUisArr( val ) ) {
				a[ k ] = GSUdeepCopy( val );
			} else {
				GSUdiffAssign( a[ k ], val );
			}
		}
	} );
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
		return Object.freeze( GSUreduce( redo, ( undo, val, k ) => {
			if ( data[ k ] !== val ) {
				undo[ k ] = GSUcomposeUndo( data[ k ], val );
			}
			return undo;
		}, {} ) );
	}
	return data;
}

function GSUcreateUpdateDelete( dataSrc, fnCreate, fnUpdate, fnDelete, dataChange ) {
	GSUforEach( dataChange, ( obj, id ) => {
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
