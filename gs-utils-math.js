"use strict";

// .............................................................................
function GSUmathMod( n, m ) { return ( ( n % m ) + m ) % m; }
function GSUmathLogN( x, y ) { return Math.log( y ) / Math.log( x ); }
function GSUmathEaseInCirc( n, pow = 2 ) { return 1 - Math.sqrt( 1 - n ** pow ); }
function GSUmathEaseOutCirc( n, pow = 2 ) { return Math.sqrt( 1 - ( n - 1 ) ** pow ); }

// .............................................................................
function GSUmathRound( val, step = 1 ) { return Math.round( val / step ) * step; }
function GSUmathFloor( val, step = 1 ) { return Math.floor( val / step ) * step; }
function GSUmathCeil(  val, step = 1 ) { return Math.ceil(  val / step ) * step; }
function GSUmathFix( val, dec = 0 ) {
	return GSUisNum( val )
		? +val.toFixed( dec )
		: val?.map?.( n => +n.toFixed( dec ) ) || +val || 0;
}

// .............................................................................
function GSUmathSum( ...arr ) { return arr.reduce( ( sum, n ) => sum + +n, 0 ) || 0; }
function GSUmathAvg( ...arr ) { return GSUmathSum( ...arr ) / arr.length || 0; }
function GSUmathStack( arr, x ) {
	arr.pop();
	arr.unshift( x );
	return arr;
}

// .............................................................................
function GSUmathSign( n ) { return n >= 0 ? `+${ n }` : `${ n }`; }

// .............................................................................
function GSUmathApprox( n, x, diff ) { return GSUmathInRange( n, x - diff, x + diff ); }
function GSUmathInRange( n, min, max ) {
	if ( n === "" || ( !GSUisStr( n ) && !GSUisNum( n ) ) ) {
		return false;
	}
	return min < max
		? min <= n && n <= max
		: max <= n && n <= min;
}
function GSUmathClamp( n, min, max ) {
	___( n, "number-NaN" );
	___( min, "number" );
	___( max, "number" );
	return min < max
		? Math.max( min, Math.min( n || 0, max ) )
		: Math.max( max, Math.min( n || 0, min ) );
}

// .............................................................................
const GSUmathWaveFns = {
	sine: GSUmathWaveSine,
	square: GSUmathWaveSquare,
	sawtooth: GSUmathWaveSawtooth,
	triangle: GSUmathWaveTriangle,
};

function GSUmathWaveSine( len ) {
	___( len, "number-positive" );
	return GSUnewArray( len, i => Math.sin( ( i / ( len - 1 ) ) * Math.PI * 2 ) );
}
function GSUmathWaveSquare( len ) {
	___( len, "number-positive" );
	return GSUnewArray( len, i => i < len / 2 ? 1 : -1 );
}
function GSUmathWaveSawtooth( len ) {
	___( len, "number-positive" );
	const len2 = ( len - 1 ) * .50;

	return GSUnewArray( len, i => i < len2 ? i / len2 : -1 + ( i - len2 ) / len2 );
}
function GSUmathWaveTriangle( len ) {
	___( len, "number-positive" );
	const len25 = ( len - 1 ) * .25;
	const len75 = ( len - 1 ) * .75;

	return GSUnewArray( len, i =>
		i < len25 ? i / len25 :
		i < len75
			? +1 - ( i - len25 ) / len25
			: -1 + ( i - len75 ) / len25
	);
}

// .............................................................................
function GSUmathRealImagToXY( real, imag, width ) {
	const arr = [];
	const fn = _GSUmathRealImagToXY.bind( null, real, imag );

	for ( let x = 0; x < width; ++x ) {
		arr.push( fn( x / width ) );
	}
	return arr;
}
function _GSUmathRealImagToXY( a, b, t ) {
	return a.reduce( ( val, ai, i ) => {
		const tmp = Math.PI * 2 * i * t;

		return val + ai * Math.cos( tmp ) + b[ i ] * Math.sin( tmp );
	}, 0 );
}

// .............................................................................
function GSUmathLineFindY( ptA, ptB, x ) {
	return ptA.x < ptB.x
		? _GSUmathLineFindY( ptA, ptB, x )
		: _GSUmathLineFindY( ptB, ptA, x );
}
function _GSUmathLineFindY( ptA, ptB, x ) {
	const w = ptB.x - ptA.x;
	const h = ptB.y - ptA.y;
	const xx = x - ptA.x;

	return xx / w * h + ptA.y;
}

// .............................................................................
function GSUmathDotLineGetYFromX( dots, x ) {
	let a = null;
	let b = null;

	GSUforEach( dots, d => {
		if ( GSUmathInRange( d.x, a?.x ?? -Infinity, x ) ) {
			a = d;
		}
	} );
	GSUforEach( dots, d => {
		if ( GSUmathInRange( d.x, x, b?.x ?? Infinity ) ) {
			b = d;
		}
	} );
	if ( a && b ) {
		const p = GSUmathClamp( ( x - a.x ) / ( b.x - a.x ), 0, 1 );
		const y = GSUmathDotLineGetYFromDot( b.type, b.val, p );
		const y2 = a.y < b.y ? y : 1 - y;
		const yStart = Math.min( a.y, b.y );
		const h = Math.abs( a.y - b.y );

		return yStart + y2 * h;
	}
	return 0;
}
function GSUmathDotLineGetYFromDot( type, val, p ) {
	const val2 = _GSUmathSampleDotLine_calcDotVal( type, val );

	return GSUmathClamp( _GSUmathSampleDotLine_fns[ type || "curve" ]( val2, p, 1 ), 0, 1 );
}
function GSUmathSampleDotLine( dots, nb, xstart, xend ) {
	const dataDots = Object.values( dots ).sort( ( a, b ) => a.x - b.x );
	const dataFloat = GSUnewArray( nb, 0 );

	if ( dataDots.length > 1 ) {
		const xa = xstart ?? dataDots[ 0 ].x;
		const xb = xend ?? dataDots.at( -1 ).x;
		const stepX = ( xb - xa ) / ( nb - 1 );
		let currX = xa;
		let fn = null;
		let dot = null;
		let type = null;
		let prevDot = null;
		let dotI = 0;
		let dotW = 0;
		let dotH = 0;
		let i2 = 0;

		for ( let i = 0; i < nb; ++i ) {
			while ( dotI < dataDots.length - 1 && ( !dotI || currX >= dataDots[ dotI ].x ) ) {
				i2 = 0;
				prevDot = dataDots[ dotI ];
				dot = dataDots[ ++dotI ];
				type = dot.type in _GSUmathSampleDotLine_fns ? dot.type : "line";
				dotW = dot.x - prevDot.x;
				dotH = dot.y - prevDot.y;
				fn = _GSUmathSampleDotLine_fns[ type ].bind( null, _GSUmathSampleDotLine_calcDotVal( type, dot.val ) );
			}

			const p = GSUmathClamp( ( currX - prevDot.x ) / dotW, 0, 1 );
			const y = GSUmathClamp( fn( p, i2++ ), 0, 1 );

			dataFloat[ i ] = [ currX, prevDot.y + dotH * y ];
			currX += stepX;
		}
	}
	return dataFloat;
}
function _GSUmathSampleDotLine_calcDotVal( type, val ) {
	const dotVal = ( !type || type.endsWith( "urve" ) ? val : Math.round( val ) );
	const dotVal2 = !dotVal && (
		type === "stair" ||
		type === "sineWave" ||
		type === "triangleWave" ||
		type === "squareWave"
	) ? 1 : dotVal;

	return dotVal2;
}
const _GSUmathSampleDotLine_fns = Object.freeze( {
	hold: () => 0,
	line: ( _, p ) => p,
	curve: ( val, p ) => {
		return val > 0
			? 1 - ( ( 1 - p ) ** ( val + 1 ) )
			: p ** -( val - 1 );
	},
	doubleCurve: ( val, p ) => {
		return p > .5
			? _GSUmathSampleDotLine_fns.curve( val, ( p - .5 ) * 2 ) / 2 + .5
			: _GSUmathSampleDotLine_fns.curve( -val, p * 2 ) / 2;
	},
	stair: ( val, p, i ) => {
		const nbStairsAbs = Math.abs( val );
		const inv = val > 0;
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
