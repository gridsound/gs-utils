"use strict";

const GSUonMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/u.test( navigator.userAgent );
const GSUonIphone = [ "iPhone Simulator", "iPhone" ].includes( navigator.platform );
const GSUonOpera = navigator.userAgent.toLowerCase().includes( "op" );
const GSUonChrome = navigator.userAgent.includes( "Chrome" ) && !GSUonOpera;
const GSUonSafari = navigator.userAgent.includes( "Safari" ) && !GSUonChrome;
const GSUonFirefox = navigator.userAgent.includes( "Firefox" );

// .............................................................................
function GSUnoop() {}
function GSUnoopFalse() {
	return false;
}
function GSUisNoop( fn ) {
	return !fn || fn === GSUnoop || fn === GSUnoopFalse;
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

// .............................................................................
function GSUnewArray( l, fn ) {
	return fn === undefined
		? new Array( l )
		: typeof fn === "function"
			? Array.from( { length: l }, ( _, i ) => fn( i ) )
			: Array.from( { length: l } ).fill( fn );
}
function GSUarrayFrom( a ) {
	return Array.isArray( a ) ? a :
		"length" in a ? Array.from( a ) : [ a ];
}
function GSUarrayLength( arr, len, fn ) {
	if ( arr.length !== len ) {
		if ( arr.length > len ) {
			arr.length = len;
		} else {
			while ( arr.length < len ) {
				arr.push( typeof fn === "function" ? fn( arr.length ) : fn );
			}
		}
	}
	return arr;
}

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

// .............................................................................
function GSUisObject( o ) {
	return o !== null && typeof o === "object";
}
function GSUisEmpty( o ) {
	for ( const a in o ) {
		return false;
	}
	return true;
}
function GSUisntEmpty( o ) {
	return !GSUisEmpty( o );
}

// .............................................................................
function GSUtrim2( str ) {
	return str ? str.trim().replace( /\s+/ug, " " ) : "";
}

// .............................................................................
function GSUeaseInCirc( n, pow = 2 ) {
	return 1 - Math.sqrt( 1 - n ** pow );
}
function GSUeaseOutCirc( n, pow = 2 ) {
	return Math.sqrt( 1 - ( n - 1 ) ** pow );
}

// .............................................................................
function GSUisNum( n ) {
	return typeof n === "number" && !Number.isNaN( n );
}
function GSUsignNum( n ) {
	return n > 0 ? `+${ n }` : `${ n }`;
}
function GSUinRange( n, min, max ) {
	return min < max
		? min <= n && n <= max
		: max <= n && n <= min;
}
function GSUapproxEqual( n, x, diff ) {
	return GSUinRange( n, x - diff, x + diff );
}
function GSUroundNum( val, dec = 0 ) {
	return typeof val === "number"
		? +val.toFixed( dec )
		: val.map( n => +n.toFixed( dec ) );
}
function GSUclampNum( n, min, max ) {
	return min < max
		? Math.max( min, Math.min( n || 0, max ) )
		: Math.max( max, Math.min( n || 0, min ) );
}
function GSUsplitNums( str, del = " " ) {
	return str.split( del ).map( n => +n );
}
function GSUsum( arr ) {
	return arr.reduce( ( sum, n ) => sum + n, 0 );
}
function GSUavg( arr ) {
	return GSUsum( arr ) / arr.length || 0;
}
function GSUstack( arr, x ) {
	arr.pop();
	arr.unshift( x );
	return arr;
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
	uuid[ 8 ] =
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
