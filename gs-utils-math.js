"use strict";

function GSUmathLogN( x, y ) { return Math.log( y ) / Math.log( x ); }
function GSUmathEaseInCirc( n, pow = 2 ) { return 1 - Math.sqrt( 1 - n ** pow ); }
function GSUmathEaseOutCirc( n, pow = 2 ) { return Math.sqrt( 1 - ( n - 1 ) ** pow ); }

function GSUmathApprox( n, x, diff ) { return GSUmathInRange( n, x - diff, x + diff ); }

function GSUmathRound( val, step = 1 ) { return Math.round( val / step ) * step; }
function GSUmathFloor( val, step = 1 ) { return Math.floor( val / step ) * step; }
function GSUmathCeil(  val, step = 1 ) { return Math.ceil(  val / step ) * step; }

function GSUmathSum( ...arr ) { return arr.reduce( ( sum, n ) => sum + +n, 0 ) || 0; }
function GSUmathAvg( ...arr ) { return GSUmathSum( ...arr ) / arr.length || 0; }

function GSUmathSign( n ) { return n >= 0 ? `+${ n }` : `${ n }`; }

function GSUmathStack( arr, x ) {
	arr.pop();
	arr.unshift( x );
	return arr;
}

function GSUmathClamp( n, min, max ) {
	return min < max
		? Math.max( min, Math.min( n || 0, max ) )
		: Math.max( max, Math.min( n || 0, min ) );
}

function GSUmathInRange( n, min, max ) {
	if ( n === "" || ( !GSUisStr( n ) && !GSUisNum( n ) ) ) {
		return false;
	}
	return min < max
		? min <= n && n <= max
		: max <= n && n <= min;
}
