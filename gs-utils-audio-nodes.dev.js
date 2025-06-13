"use strict";

const _GSUaudioGain_wm = new WeakMap();
const _GSUaudioDelay_wm = new WeakMap();
const _GSUaudioBuffer_wm = new WeakMap();
const _GSUaudioAnalyser_wm = new WeakMap();
const _GSUaudioConvolver_wm = new WeakMap();
const _GSUaudioOscillator_wm = new WeakMap();
const _GSUaudioWaveShaper_wm = new WeakMap();
const _GSUaudioBiquadFilter_wm = new WeakMap();
const _GSUaudioBufferSource_wm = new WeakMap();
const _GSUaudioPeriodicWave_wm = new WeakMap();
const _GSUaudioStereoPanner_wm = new WeakMap();
const _GSUaudioChannelMerger_wm = new WeakMap();
const _GSUaudioConstantSource_wm = new WeakMap();
const _GSUaudioChannelSplitter_wm = new WeakMap();

const GSUaudioGain            = ( c, ...a ) => { const n = c.createGain( ...a );            _GSUaudioGain_wm.set( n, 1 );            return n; };
const GSUaudioDelay           = ( c, ...a ) => { const n = c.createDelay( ...a );           _GSUaudioDelay_wm.set( n, 1 );           return n; };
const GSUaudioBuffer          = ( c, ...a ) => { const n = c.createBuffer( ...a );          _GSUaudioBuffer_wm.set( n, 1 );          return n; };
const GSUaudioAnalyser        = ( c, ...a ) => { const n = c.createAnalyser( ...a );        _GSUaudioAnalyser_wm.set( n, 1 );        return n; };
const GSUaudioConvolver       = ( c, ...a ) => { const n = c.createConvolver( ...a );       _GSUaudioConvolver_wm.set( n, 1 );       return n; };
const GSUaudioOscillator      = ( c, ...a ) => { const n = c.createOscillator( ...a );      _GSUaudioOscillator_wm.set( n, 1 );      return n; };
const GSUaudioWaveShaper      = ( c, ...a ) => { const n = c.createWaveShaper( ...a );      _GSUaudioWaveShaper_wm.set( n, 1 );      return n; };
const GSUaudioBiquadFilter    = ( c, ...a ) => { const n = c.createBiquadFilter( ...a );    _GSUaudioBiquadFilter_wm.set( n, 1 );    return n; };
const GSUaudioBufferSource    = ( c, ...a ) => { const n = c.createBufferSource( ...a );    _GSUaudioBufferSource_wm.set( n, 1 );    return n; };
const GSUaudioPeriodicWave    = ( c, ...a ) => { const n = c.createPeriodicWave( ...a );    _GSUaudioPeriodicWave_wm.set( n, 1 );    return n; };
const GSUaudioStereoPanner    = ( c, ...a ) => { const n = c.createStereoPanner( ...a );    _GSUaudioStereoPanner_wm.set( n, 1 );    return n; };
const GSUaudioChannelMerger   = ( c, ...a ) => { const n = c.createChannelMerger( ...a );   _GSUaudioChannelMerger_wm.set( n, 1 );   return n; };
const GSUaudioConstantSource  = ( c, ...a ) => { const n = c.createConstantSource( ...a );  _GSUaudioConstantSource_wm.set( n, 1 );  return n; };
const GSUaudioChannelSplitter = ( c, ...a ) => { const n = c.createChannelSplitter( ...a ); _GSUaudioChannelSplitter_wm.set( n, 1 ); return n; };

function GSUaudioLogWeakMaps() {
	console.log( "gain", _GSUaudioGain_wm );
	console.log( "delay", _GSUaudioDelay_wm );
	console.log( "buffer", _GSUaudioBuffer_wm );
	console.log( "analyser", _GSUaudioAnalyser_wm );
	console.log( "convolver", _GSUaudioConvolver_wm );
	console.log( "oscillator", _GSUaudioOscillator_wm );
	console.log( "waveShaper", _GSUaudioWaveShaper_wm );
	console.log( "biquadFilter", _GSUaudioBiquadFilter_wm );
	console.log( "bufferSource", _GSUaudioBufferSource_wm );
	console.log( "periodicWave", _GSUaudioPeriodicWave_wm );
	console.log( "stereoPanner", _GSUaudioStereoPanner_wm );
	console.log( "channelMerger", _GSUaudioChannelMerger_wm );
	console.log( "constantSource", _GSUaudioConstantSource_wm );
	console.log( "channelSplitter", _GSUaudioChannelSplitter_wm );
}
