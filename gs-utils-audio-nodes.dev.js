"use strict";

const _GSUaudioContext_wm = new WeakMap();
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

const GSUaudioContext         = (    ...a ) => { const n = new AudioContext( ...a );        _GSUaudioContext_wm.set( n, 1 );         return n; };
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

function GSUaudioLogWeakMaps( m ) {
	( !m || m === "context"         ) && console.log( "context", _GSUaudioContext_wm );
	( !m || m === "gain"            ) && console.log( "gain", _GSUaudioGain_wm );
	( !m || m === "delay"           ) && console.log( "delay", _GSUaudioDelay_wm );
	( !m || m === "buffer"          ) && console.log( "buffer", _GSUaudioBuffer_wm );
	( !m || m === "analyser"        ) && console.log( "analyser", _GSUaudioAnalyser_wm );
	( !m || m === "convolver"       ) && console.log( "convolver", _GSUaudioConvolver_wm );
	( !m || m === "oscillator"      ) && console.log( "oscillator", _GSUaudioOscillator_wm );
	( !m || m === "waveShaper"      ) && console.log( "waveShaper", _GSUaudioWaveShaper_wm );
	( !m || m === "biquadFilter"    ) && console.log( "biquadFilter", _GSUaudioBiquadFilter_wm );
	( !m || m === "bufferSource"    ) && console.log( "bufferSource", _GSUaudioBufferSource_wm );
	( !m || m === "periodicWave"    ) && console.log( "periodicWave", _GSUaudioPeriodicWave_wm );
	( !m || m === "stereoPanner"    ) && console.log( "stereoPanner", _GSUaudioStereoPanner_wm );
	( !m || m === "channelMerger"   ) && console.log( "channelMerger", _GSUaudioChannelMerger_wm );
	( !m || m === "constantSource"  ) && console.log( "constantSource", _GSUaudioConstantSource_wm );
	( !m || m === "channelSplitter" ) && console.log( "channelSplitter", _GSUaudioChannelSplitter_wm );
}
