"use strict";

function GSUnoop() {}

const GSUonMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/u.test( navigator.userAgent );

// -----------------------------------------------------------------------------
function GSUisNum( n ) {
	return typeof n === "number" && !Number.isNaN( n );
}

// -----------------------------------------------------------------------------
function GSUeaseInCirc( n ) {
	return 1 - Math.sqrt( 1 - Math.pow( n, 2 ) );
}
function GSUeaseOutCirc( n ) {
	return Math.sqrt( 1 - Math.pow( n - 1, 2 ) );
}

// -----------------------------------------------------------------------------
function GSUroundNum( val, dec = 0 ) {
	return typeof val === "number"
		? +val.toFixed( dec )
		: val.map( n => +n.toFixed( dec ) );
}
function GSUclampNum( n, min, max ) {
	return (
		min < max
			? Math.max( min, Math.min( n || 0, max ) )
			: Math.max( max, Math.min( n || 0, min ) )
	);
}
function GSUsplitNums( str, del = " " ) {
	return str.split( del ).map( n => +n );
}
