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

// .............................................................................
function GSUisEqual( a, b ) {
	if ( !GSUisObj( a ) || !GSUisObj( b ) ) {
		return Object.is( a, b );
	}
	return GSUisArr( a ) === GSUisArr( b ) && _GSUisEqual( a, b ) && _GSUisEqual( b, a )
}
function _GSUisEqual( a, b ) {
	for ( const i in a ) {
		const eq = GSUisEqual( a[ i ], b[ i ] );

		if ( eq === false ) {
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

// .............................................................................
function GSUnewArray( l, fn ) {
	return fn === undefined
		? new Array( l )
		: GSUisFun( fn )
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
				arr.push( GSUisFun( fn ) ? fn( arr.length ) : fn );
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

// GSUisXxxxx
// .............................................................................
function GSUisObj( o ) { return o !== null && typeof o === "object"; }
function GSUisArr( a ) { return Array.isArray( a ); }
function GSUisStr( n ) { return typeof n === "string"; }
function GSUisFun( n ) { return typeof n === "function"; }
function GSUisNum( n ) { return typeof n === "number" && !Number.isNaN( n ); }
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

// .............................................................................
function GSUeaseInCirc( n, pow = 2 ) {
	return 1 - Math.sqrt( 1 - n ** pow );
}
function GSUeaseOutCirc( n, pow = 2 ) {
	return Math.sqrt( 1 - ( n - 1 ) ** pow );
}

// .............................................................................
function GSUlogN( x, y ) {
	return Math.log( y ) / Math.log( x );
}
function GSUsignNum( n ) {
	return n >= 0 ? `+${ n }` : `${ n }`;
}
function GSUinRange( n, min, max ) {
	if ( n === "" || ( !GSUisStr( n ) && !GSUisNum( n ) ) ) {
		return false;
	}
	return min < max
		? min <= n && n <= max
		: max <= n && n <= min;
}
function GSUapproxEqual( n, x, diff ) {
	return GSUinRange( n, x - diff, x + diff );
}
function GSUroundNum( val, dec = 0 ) {
	return GSUisNum( val )
		? +val.toFixed( dec )
		: val?.map?.( n => +n.toFixed( dec ) ) || +val || 0;
}
function GSUclampNum( n, min, max ) {
	return min < max
		? Math.max( min, Math.min( n || 0, max ) )
		: Math.max( max, Math.min( n || 0, min ) );
}
function GSUsplitNums( str, del = " " ) {
	return str && GSUisStr( str ) ? str.split( del ).map( n => +n || 0 ) : [];
}
function GSUsplitInts( str, del = " " ) {
	return str && GSUisStr( str ) ? str.split( del ).map( n => n | 0 ) : [];
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
function GSUrealImagToXY( real, imag, width ) {
	const arr = [];
	const fn = _GSUrealImagToXY.bind( null, real, imag );

	for ( let x = 0; x < width; ++x ) {
		arr.push( fn( x / width ) );
	}
	return arr;
}
function _GSUrealImagToXY( a, b, t ) {
	return a.reduce( ( val, ai, i ) => {
		const tmp = Math.PI * 2 * i * t;

		return val + ai * Math.cos( tmp ) + b[ i ] * Math.sin( tmp );
	}, 0 );
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
			mod[ key ] = val;
		}
	} );
	return Object.seal( mod );
}

// .............................................................................
function GSUlineFindY( ptA, ptB, x ) {
	return ptA.x < ptB.x
		? _GSUlineFindY( ptA, ptB, x )
		: _GSUlineFindY( ptB, ptA, x );
}
function _GSUlineFindY( ptA, ptB, x ) {
	const w = ptB.x - ptA.x;
	const h = ptB.y - ptA.y;
	const xx = x - ptA.x;

	return xx / w * h + ptA.y;
}

// .............................................................................
function GSUsampleDotLine( dots, nb ) {
	const dataDots = Object.values( dots ).sort( ( a, b ) => a.x - b.x );
	const dataFloat = GSUnewArray( nb, 0 );

	if ( dataDots.length > 1 ) {
		const stepX = ( dataDots.at( -1 ).x - dataDots[ 0 ].x ) / ( nb - 1 );
		let currX = dataDots[ 0 ].x;
		let fn = null;
		let dot = null;
		let prevDot = null;
		let dotI = 0;
		let dotW = 0;
		let dotH = 0;

		for ( let i = 0; i < nb; ++i ) {
			while ( dotI < dataDots.length - 1 && ( !dotI || currX >= dataDots[ dotI ].x ) ) {
				prevDot = dataDots[ dotI ];
				dot = dataDots[ ++dotI ];
				dotW = ( dot.x - prevDot.x );
				dotH = ( dot.y - prevDot.y );
				fn = (
					!dot.val
						? _GSUsampleDotLine_fns.line
						: _GSUsampleDotLine_fns[ dot.type ] || _GSUsampleDotLine_fns.line
				).bind( null, dot.val );
			}

			const p = GSUclampNum( ( currX - prevDot.x ) / dotW, 0, 1 );
			const y = GSUclampNum( fn( p, i ), 0, 1 );

			dataFloat[ i ] = [ currX, prevDot.y + dotH * y ];
			currX += stepX;
		}
	}
	return dataFloat;
}
const _GSUsampleDotLine_fns = Object.freeze( {
	line: ( _, p ) => p,
	stair: ( val, p, i ) => {
		const nbStairsAbs = Math.abs( val );
		const inv = val < 0;
		const y = ( Math.floor( p / ( 1 / ( nbStairsAbs + inv ) ) ) + !inv ) * ( 1 / ( nbStairsAbs + !inv ) );

		return i ? y : 0;
	},
	sineWave: ( val, p ) => {
		const val2 = Math.abs( val );
		const val3 = val2 * ( ( val2 - .5 ) / val2 );
		const p2 = val < 0 ? p + 1 : p;

		return .5 + Math.sin( Math.PI * 1.5 + p2 * val3 * Math.PI * 2 ) / 2;
	},
	triangleWave: ( val, p ) => {
		const val2 = Math.abs( val );
		const val3 = val2 * ( ( val2 - .5 ) / val2 );
		const p2 = val < 0 ? p + 1 : p;

		return -Math.abs( 2 * val3 * p2 % 2 - 1 ) + 1;
	},
	squareWave: ( val, p ) => {
		const val2 = Math.floor( p / ( 1 / ( val * 2 ) ) ) % 2 === 0;

		return val2 && p < 1 ? 0 : 1;
	},
} );
