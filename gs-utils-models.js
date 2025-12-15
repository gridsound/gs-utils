"use strict";

// .............................................................................
GSUsetModel( "track", {
	name: "",
	order: 0,
	toggle: true,
} );
GSUsetModel( "block", {
	pattern: null,
	duration: 0,
	durationEdited: false,
	selected: false,
	offset: 0,
	when: 0,
	track: null,
} );

// .............................................................................
GSUsetModel( "channel", {
	order: 0,
	toggle: true,
	name: "chan",
	dest: "main",
	gain: 1,
	pan: 0,
} );
GSUsetModel( "channelMain", {
	toggle: true,
	name: "main",
	gain: .4,
	pan: 0,
} );
GSUsetModel( "channels", {
	main: GSUgetModel( "channelMain" ),
	1: GSUgetModel( "channel", { order: 0, name: "drums" } ),
	2: GSUgetModel( "channel", { order: 1, name: "synth" } ),
	3: GSUgetModel( "channel", { order: 2, name: "chan 3" } ),
	4: GSUgetModel( "channel", { order: 3, name: "chan 4" } ),
} );

// .............................................................................
GSUsetModel( "drumrow", {
	order: 0,
	toggle: true,
	pattern: null,
	detune: 0,
	gain: 1,
	pan: 0,
} );
GSUsetModel( "drum", {
	when: 0,
	row: null,
	detune: 0,
	gain: .8,
	pan: 0,
} );
GSUsetModel( "drumcut", {
	when: 0,
	row: null,
} );

// .............................................................................
GSUsetModel( "envGain", {
	toggle: true,
	attack: .04,
	hold: 0,
	decay: .08,
	sustain: .75,
	release: .25,
} );
GSUsetModel( "envDetune", {
	toggle: false,
	amp: 24,
	attack: 0,
	hold: 0,
	decay: .25,
	sustain: 0,
	release: .1,
} );
GSUsetModel( "envLowpass", {
	toggle: false,
	attack: 0,
	hold: 0,
	decay: 1,
	sustain: 0,
	release: 0,
	q: 1,
} );
GSUsetModel( "lfo", {
	toggle: false,
	type: "sine",
	delay: 0,
	attack: 1,
	speed: 1,
	amp: 1,
} );
GSUsetModel( "noise", {
	toggle: false,
	color: "white",
	gain: .1,
	pan: 0,
} );
GSUsetModel( "oscillator", {
	order: 0,
	wave: "sine",
	wavetable: null,
	source: null,
	phaze: 0,
	pan: 0,
	gain: 1,
	detune: 0,
	detunefine: 0,
	unisonvoices: 1,
	unisondetune: .2,
	unisonblend: .33,
} );
GSUsetModel( "wavetable", {
	div: "16 16",
	wave: "0",
	tool: "goUp",
	symmetry: false,
	waves: {
		0: {
			index: 0,
			curve: GSUnewArray( 2048, 0 ),
		},
	},
	wtposCurves: {
		...GSUnewArray( 10, () => ( {
			duration: 1,
			curve: {
				0: { x: 0, y: 0, type: null, val: null },
				1: { x: 1, y: 1, type: "curve", val: 0 },
			},
		} ) ),
	},
} );
GSUsetModel( "synth", {
	name: "synth",
	dest: "main",
	octave: 4,
	envs: {
		gain: GSUgetModel( "envGain" ),
		detune: GSUgetModel( "envDetune" ),
		lowpass: GSUgetModel( "envLowpass" ),
	},
	lfos: {
		gain: GSUgetModel( "lfo" ),
		detune: GSUgetModel( "lfo", { amp: 12 } ),
	},
	noise: GSUgetModel( "noise" ),
	oscillators: {},
} );

// .............................................................................
GSUsetModel( "key", {
	prev: null,
	next: null,
	key: 57,
	when: 0,
	duration: 1,
	gain: .8,
	gainLFOAmp: 1,
	gainLFOSpeed: 1,
	pan: 0,
	highpass: 1,
	lowpass: 1,
	wtposCurves: {},
	selected: false,
} );

// .............................................................................
GSUsetModel( "fx.delay", {
	time: .5,
	gain: .5,
	pan: -.5,
} );
GSUsetModel( "fx.filter", {
	type: "lowpass",
	Q: 5,
	gain: -20,
	detune: 0,
	frequency: 500,
} );
GSUsetModel( "fx.reverb", {
	dry: .6,
	wet: 1.5,
	delay: 0,
	fadein: 0,
	decay: 1,
} );
GSUsetModel( "fx.waveshaper", {
	symmetry: true,
	oversample: "none",
	curve: {
		0: { x: 0, y: 0, type: null, val: null },
		1: { x: 1, y: 1, type: "curve", val: 0 },
	},
} );
