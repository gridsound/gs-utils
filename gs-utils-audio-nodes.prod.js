"use strict";

const GSUaudioContext = ( ...a ) => new AudioContext( ...a );
const GSUaudioGain = ( c, ...a ) => c.createGain( ...a );
const GSUaudioDelay = ( c, ...a ) => c.createDelay( ...a );
const GSUaudioBuffer = ( c, ...a ) => c.createBuffer( ...a );
const GSUaudioAnalyser = ( c, ...a ) => c.createAnalyser( ...a );
const GSUaudioConvolver = ( c, ...a ) => c.createConvolver( ...a );
const GSUaudioOscillator = ( c, ...a ) => c.createOscillator( ...a );
const GSUaudioWaveShaper = ( c, ...a ) => c.createWaveShaper( ...a );
const GSUaudioBiquadFilter = ( c, ...a ) => c.createBiquadFilter( ...a );
const GSUaudioBufferSource = ( c, ...a ) => c.createBufferSource( ...a );
const GSUaudioPeriodicWave = ( c, ...a ) => c.createPeriodicWave( ...a );
const GSUaudioStereoPanner = ( c, ...a ) => c.createStereoPanner( ...a );
const GSUaudioChannelMerger = ( c, ...a ) => c.createChannelMerger( ...a );
const GSUaudioConstantSource = ( c, ...a ) => c.createConstantSource( ...a );
const GSUaudioChannelSplitter = ( c, ...a ) => c.createChannelSplitter( ...a );
