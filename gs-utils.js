"use strict";

const GSUonMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/u.test( navigator.userAgent );
const GSUonIphone = [ "iPhone Simulator", "iPhone" ].includes( navigator.platform );
const GSUonOpera = navigator.userAgent.toLowerCase().includes( "op" );
const GSUonChrome = navigator.userAgent.includes( "Chrome" ) && !GSUonOpera;
const GSUonSafari = navigator.userAgent.includes( "Safari" ) && !GSUonChrome;
const GSUonFirefox = navigator.userAgent.includes( "Firefox" );

// .............................................................................
const GSUdotProp_undefined = Symbol();
function GSUdotProp( obj, path ) {
	return !path ? obj : path.split( "." ).filter( Boolean ).reduce( ( obj, p ) => (
		!GSUisObj( obj ) || !( p in obj )
			? undefined
			: obj[ p ] === undefined
				? GSUdotProp_undefined
				: obj[ p ]
	), obj );
}

// .............................................................................
function GSUisEqual( a, b ) {
	if ( !GSUisObj( a ) || !GSUisObj( b ) ) {
		return Object.is( a, b );
	}
	return GSUisArr( a ) === GSUisArr( b ) && _GSUisEqual( a, b ) && _GSUisEqual( b, a );
}
function _GSUisEqual( a, b ) {
	for ( const i in a ) {
		if ( !GSUisEqual( a[ i ], b[ i ] ) ) {
			return false;
		}
	}
	return true;
}

// .............................................................................
function GSUforEach( obj, fn ) {
	if ( obj?.forEach ) {
		obj.forEach( fn );
	} else {
		for ( const k in obj ) {
			fn( obj[ k ], k, obj );
		}
	}
	return obj;
}
function GSUreduce( obj, fn, val ) {
	return obj?.reduce
		? obj.reduce( fn, val )
		: _GSUreduce( obj, fn, val );
}
function _GSUreduce( obj, fn, val ) {
	let val2 = val;

	for ( const k in obj ) {
		val2 = fn( val2, obj[ k ], k, obj );
	}
	return val2;
}
function GSUsome( obj, fn ) {
	if ( obj?.some ) {
		return obj.some( fn );
	}
	for ( const k in obj ) {
		if ( fn( obj[ k ], k, obj ) ) {
			return true;
		}
	}
	return false;
}

// .............................................................................
// ..... GSUarray ..............................................................
// .............................................................................
function GSUnewArray( l, fn ) {
	return fn === undefined
		? new Array( l )
		: GSUisFun( fn )
			? Array.from( { length: l }, ( _, i ) => fn( i ) )
			: Array.from( { length: l } ).fill( fn );
}
function GSUarrayEq( a, b, diff ) {
	___( a, "arrayOfNumber" );
	___( b, "arrayOfNumber" );
	___( diff, "number-undefined" );
	return a.length === b.length && a.every( diff
		? ( a, i ) => GSUmathApprox( a, b[ i ], diff )
		: ( a, i ) => a === b[ i ]
	);
}
function GSUarrayFrom( a ) {
	return GSUisArr( a ) ? a : "length" in a ? Array.from( a ) : [ a ];
}
function GSUarrayLength( arr, len, fn ) {
	if ( arr.length !== len ) {
		if ( arr.length > len ) {
			arr.length = len;
		} else {
			while ( arr.length < len ) {
				arr.push( GSUisFun( fn ) ? fn( arr.length ) : fn );
			}
		}
	}
	return arr;
}
function GSUarrayRemove( arr, fn ) {
	const fn2 = GSUisFun( fn ) ? fn : Object.is.bind( null, fn );
	let i = 0;
	let j = 0;

	for ( ; i < arr.length; ++i ) {
		if ( !fn2( arr[ i ] ) ) {
			arr[ j++ ] = arr[ i ];
		}
	}
	arr.length = j;
	return arr;
}
function GSUarrayResize( arr, len ) {
	___( arr, "arrayOfNumber" );
	___( len, "integer-positive-0" );
	if ( len < 1 ) { return []; }
	if ( len === 1 ) { return [ arr[ 0 ] || 0 ]; }
	if ( arr.length === len ) { return [ ...arr ]; }

	const oldLen = arr.length - 1;
	const scale = oldLen / ( len - 1 );

	return GSUnewArray( len, i => {
		const i2 = i * scale;
		const a = Math.floor( i2 );
		const b = Math.min( Math.ceil( i2 ), oldLen );
		const t = i2 - a;

		return ( 1 - t ) * arr[ a ] + t * arr[ b ];
	} );
}

// .............................................................................
// ..... GSUisXxx ..............................................................
// .............................................................................
function GSUisObj( o ) { return o !== null && typeof o === "object"; }
function GSUisArr( a ) { return Array.isArray( a ); }
function GSUisNaN( n ) { return Number.isNaN( n ); }
function GSUisStr( n ) { return typeof n === "string"; }
function GSUisFun( n ) { return typeof n === "function"; }
function GSUisBoo( n ) { return typeof n === "boolean"; }
function GSUisNum( n ) { return typeof n === "number" && !GSUisNaN( n ); }
function GSUisInt( n ) { return GSUisNum( n ) && n === Math.round( n ); }
function GSUisEmpty( o ) {
	for ( const a in o ) {
		return false;
	}
	return !o?.size;
}

// .............................................................................
function GSUtrim2( str ) {
	return str?.trim?.().replace( /\s+/ug, " " ) || "";
}
function GSUcountChar( str, c ) {
	return Math.max( 0, str?.split?.( c ).length - 1 ) || 0;
}

// .............................................................................
function GSUsplitNums( str, del = " " ) {
	return str && GSUisStr( str ) ? str.split( del ).map( n => +n || 0 ) : [];
}
function GSUsplitInts( str, del = " " ) {
	return str && GSUisStr( str ) ? str.split( del ).map( n => n | 0 ) : [];
}
function GSUsplitSeconds( sec ) {
	const m = `${ sec / 60 | 0 }`;
	const s = `${ sec - m * 60 | 0 }`.padStart( 2, "0" );
	const ms = `${ ( sec - ( sec | 0 ) ) * 1000 | 0 }`.padStart( 3, "0" );

	return { m, s, ms };
}

// .............................................................................
function GSUuuid() {
	const rnd = crypto.getRandomValues( new Uint8Array( 36 ) );
	const uuid = rnd.reduce( ( arr, n ) => {
		arr.push( ( n % 16 ).toString( 16 ) );
		return arr;
	}, [] );

	uuid[ 14 ] = "4";
	uuid[ 19 ] = ( 8 + rnd[ 19 ] % 4 ).toString( 16 );
	uuid[  8 ] =
	uuid[ 13 ] =
	uuid[ 18 ] =
	uuid[ 23 ] = "-";
	return uuid.join( "" );
}

// .............................................................................
function GSUuniqueName( nameOri, arr ) {
	const name = GSUtrim2( nameOri );

	if ( arr.includes( name ) ) {
		const name2 = /-\d+$/u.test( name )
			? name.substring( 0, name.lastIndexOf( "-" ) ).trim()
			: name;
		const reg = new RegExp( `^${ name2 }-(\\d+)$`, "u" );
		const nb = arr.reduce( ( nb, str ) => {
			const res = reg.exec( str );

			return res ? Math.max( nb, +res[ 1 ] ) : nb;
		}, 1 );

		return `${ name2 }-${ nb + 1 }`;
	}
	return name;
}

// .............................................................................
function GSUplural( nb, word, s ) {
	const w = word[ word.length - 1 ] === "s"
		? word
		: `${ word }${ nb > 1 ? "s" : "" }`;
	const ws = s !== "'s"
		? w
		: `${ w }'${ w[ w.length - 1 ] === "s" ? "" : "s" }`;

	return `${ nb } ${ ws }`;
}

// .............................................................................
const GSUmodels = new Map();
function GSUsetModel( id, obj ) {
	GSUmodels.set( id, GSUdeepFreeze( obj ) );
}
function GSUgetModel( id, obj ) {
	const mod = GSUdeepCopy( GSUmodels.get( id ) );

	if ( !mod ) {
		return null;
	}
	GSUforEach( obj, ( val, key ) => {
		if ( key in mod ) {
			mod[ key ] = GSUdeepCopy( val );
		}
	} );
	return Object.seal( mod );
}
