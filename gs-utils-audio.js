"use strict";

/* eslint-disable */
let GSUaudioCurrentContext = null;

// .............................................................................
const GSUXtoHz_a = 128;
const GSUXtoHz_b = .945;
const GSUXtoHz_c = GSUXtoHz_a - GSUXtoHz_b;
/* eslint-enable */

// ( ( 128 ** x ) - .945 ) / ( 128 - .945 );
// GSUmathLogN( 128, x * ( 128 - .945 ) + .945 );

function GSUXtoHz( x ) {
	return ( ( GSUXtoHz_a ** x ) - GSUXtoHz_b ) / GSUXtoHz_c;
	// return 2 ** ( x * 11 - 11 );
}
// GSUHztoX( val / this.#nyquist )
function GSUHztoX( x ) {
	return GSUmathLogN( GSUXtoHz_a, x * GSUXtoHz_c + GSUXtoHz_b );
	// return ( Math.log2( x ) + 11 ) / 11;
}

// .............................................................................
// "main.gain"
// "main.0_filter.gain"
function GSUaudioStringifyTarget( chanId, fxId, fxType, prop ) {
	return prop
		? `${ chanId }.${ fxId }_${ fxType }.${ prop }`
		: `${ chanId }.${ fxId }`;
}
function GSUaudioParseTarget( target ) {
	const arr = target.split( "." );
	const [ chan, fx, prop ] = arr;

	if ( arr.length === 3 ) {
		const [ fxId, fxType ] = fx.split( "_" );

		return {
			$channelId: chan,
			$effectId: fxId,
			$effectType: fxType,
			$prop: prop,
		};
	}
	return {
		$channelId: chan,
		$prop: fx,
	};
}

// .............................................................................
function GSUaudioDelayDuration( time, gain, target = .1 ) {
	return (
		gain <= 0 ? 0 :
		gain >= 1 ? Infinity :
		Math.ceil( Math.log( target ) / Math.log( gain ) ) * time
	);
}

// .............................................................................
function GSUformatWavetableName( synthId, oscId )    { return `custom.s${ synthId }.o${ oscId }`; }
function GSUformatWaveName( synthId, oscId, waveId ) { return `custom.s${ synthId }.o${ oscId }.${ waveId }`; }
function GSUisWavetableName( name ) { return GSUisStr( name ) && name.startsWith( "custom.s" ) && GSUcountChar( name, "." ) === 2; }
function GSUisWaveName( name )      { return GSUisStr( name ) && name.startsWith( "custom.s" ) && GSUcountChar( name, "." ) === 3; }

// .............................................................................
function GSUaudioParamCancel( aparam, when = 0 ) {
	aparam.cancelScheduledValues( when );
}
function GSUaudioParamSet( aparam, val, when = 0 ) {
	aparam.setValueAtTime( val, when );
}
function GSUaudioParamSetCurve( aparam, arr, when, dur ) {
	aparam.setValueCurveAtTime( arr, when, dur );
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
function GSUpanningMerge_LR( l, r ) {
	return (
		l > r ? -1 + r / l :
		l < r ?  1 - l / r : 0
	);
}
function GSUpanningSplit_LR( pan ) {
	return (
		pan < 0 ? [ 1, 1 + pan ] :
		pan > 0 ? [ 1 - pan, 1 ] : [ 1, 1 ]
	);
}
function GSUpanningMerge( ...pans ) {
	const lr = pans.map( GSUpanningSplit_LR )
		.reduce( ( ret, lr ) => {
			ret[ 0 ] *= lr[ 0 ];
			ret[ 1 ] *= lr[ 1 ];
			return ret;
		}, [ 1, 1 ] );

	return GSUpanningMerge_LR( ...lr );
}

// .............................................................................
function GSUcloneBuffer( ctx, buf ) {
	const bufSize = buf.duration * ctx.sampleRate;
	const nbChans = buf.numberOfChannels;
	const cpy = GSUaudioBuffer( ctx, nbChans, bufSize, ctx.sampleRate );

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
