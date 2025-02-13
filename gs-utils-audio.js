"use strict";

const GSUXtoHz_a = 128;
const GSUXtoHz_b = .945;
const GSUXtoHz_c = GSUXtoHz_a - GSUXtoHz_b;

function GSUXtoHz( x ) {
	return ( ( GSUXtoHz_a ** x ) - GSUXtoHz_b ) / GSUXtoHz_c;
	// return 2 ** ( x * 11 - 11 );
}
function GSUHztoX( x ) {
	return GSUlogN( GSUXtoHz_a, ( x * GSUXtoHz_c + GSUXtoHz_b ) );
	// return ( Math.log2( x ) + 11 ) / 11;
}

// .............................................................................
function GSUhashBufferV1( u8buf ) {
	const hash = new Uint8Array( 19 );
	const len = `${ u8buf.length }`.padStart( 9, "0" );
	let i = 0;
	let ind = 0;

	for ( const u8 of u8buf ) {
		hash[ ind ] += u8;
		if ( ++ind >= 19 ) {
			ind = 0;
		}
		if ( ++i >= 1000000 ) {
			break;
		}
	}
	return `1-${ len }-${ Array.from( hash )
		.map( u8 => u8.toString( 16 ).padStart( 2, "0" ) )
		.join( "" ) }`;
}

// .............................................................................
function GSUpanningMerge( ...pans ) {
	const lr = pans.map( _GSUpanningSplitLR )
		.reduce( ( ret, lr ) => {
			ret[ 0 ] *= lr[ 0 ];
			ret[ 1 ] *= lr[ 1 ];
			return ret;
		}, [ 1, 1 ] );

	return _GSUpanningMergeLR( ...lr );
}
function _GSUpanningMergeLR( l, r ) {
	return (
		l > r ? -1 + r / l :
		l < r ?  1 - l / r : 0
	);
}
function _GSUpanningSplitLR( pan ) {
	return (
		pan < 0 ? [ 1, 1 + pan ] :
		pan > 0 ? [ 1 - pan, 1 ] : [ 1, 1 ]
	);
}

// .............................................................................
function GSUcloneBuffer( ctx, buf ) {
	const bufSize = buf.duration * ctx.sampleRate;
	const nbChans = buf.numberOfChannels;
	const cpy = ctx.createBuffer( nbChans, bufSize, ctx.sampleRate );

	for ( let i = 0; i < nbChans; ++i ) {
		cpy.copyToChannel( buf.getChannelData( i ), i );
	}
	return cpy;
}

function GSUreverseBuffer( buf ) {
	for ( let i = buf.numberOfChannels - 1; i >= 0; --i ) {
		Array.prototype.reverse.call( buf.getChannelData( i ) );
	}
	return buf;
}
