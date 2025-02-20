"use strict";

function GSUfft( signal ) {
	let complexSignal = {};

	if ( signal.real === undefined || signal.imag === undefined ) {
		complexSignal = GSUfftConstructComplexArray_( signal );
	} else {
		complexSignal.real = signal.real.slice();
		complexSignal.imag = signal.imag.slice();
	}

	const N = complexSignal.real.length;
	const logN = Math.log2( N );

	if ( Math.round( logN ) !== logN ) {
		throw new Error( "GSUfft: Input size must be a power of 2." );
	}
	if ( complexSignal.real.length !== complexSignal.imag.length ) {
		throw new Error( "GSUfft: Real and imaginary components must have the same length." );
	}

	const bitReversedIndices = GSUfftBitReverseArray_( N );

	// sort array
	const ordered = {
		real: [],
		imag: [],
	};

	for ( let i = 0; i < N; ++i ) {
		ordered.real[ bitReversedIndices[ i ] ] = complexSignal.real[ i ];
		ordered.imag[ bitReversedIndices[ i ] ] = complexSignal.imag[ i ];
	}
	for ( let i = 0; i < N; ++i ) {
		complexSignal.real[ i ] = ordered.real[ i ];
		complexSignal.imag[ i ] = ordered.imag[ i ];
	}

	// iterate over the number of stages
	for ( let n = 1; n <= logN; ++n ) {
		const currN = 2 ** n;

		// find twiddle factors
		for ( let k = 0; k < currN / 2; ++k ) {
			const twiddle = GSUfftEuler_(k, currN);

			// on each block of FT, implement the butterfly diagram
			for ( let m = 0; m < N / currN; ++m ) {
				const currEvenIndex = ( currN * m ) + k;
				const currOddIndex = ( currN * m ) + k + ( currN / 2 );

				const currEvenIndexSample = {
					real: complexSignal.real[ currEvenIndex ],
					imag: complexSignal.imag[ currEvenIndex ],
				};
				const currOddIndexSample = {
					real: complexSignal.real[ currOddIndex ],
					imag: complexSignal.imag[ currOddIndex ],
				};

				const odd = GSUfftMultiply_( twiddle, currOddIndexSample );

				const subtractionResult = GSUfftSubtract_( currEvenIndexSample, odd );
				complexSignal.real[ currOddIndex ] = subtractionResult.real;
				complexSignal.imag[ currOddIndex ] = subtractionResult.imag;

				const additionResult = GSUfftAdd_( odd, currEvenIndexSample );
				complexSignal.real[ currEvenIndex ] = additionResult.real;
				complexSignal.imag[ currEvenIndex ] = additionResult.imag;
			}
		}
	}
	return complexSignal;
}

// .............................................................................
function GSUifft( signal ) {
	if ( !signal.real || !signal.imag ) {
		throw new Error( "GSUifft: only accepts a complex input." );
	}

	const N = signal.real.length;
	const complexSignal = {
		real: [],
		imag: [],
	};

	// take complex conjugate in order to be able to use the regular FFT for IFFT
	for ( let i = 0; i < N; ++i ) {
		const currentSample = {
			real: signal.real[ i ],
			imag: signal.imag[ i ],
		};
		const conjugateSample = GSUfftConj_( currentSample );

		complexSignal.real[ i ] = conjugateSample.real;
		complexSignal.imag[ i ] = conjugateSample.imag;
	}

	const X = GSUfft( complexSignal );

	complexSignal.real = X.real.map( val => val / N );
	complexSignal.imag = X.imag.map( val => val / N );
	return complexSignal;
}

// .............................................................................
function GSUfftConstructComplexArray_( signal ) {
	const real = signal.real
		? signal.real.slice()
		: signal.slice();

	return {
		real,
		imag: GSUnewArray( real.length, 0 ),
	};
}
function GSUfftBitReverseArray_( N ) {
	const maxBinaryLength = ( N - 1 ).toString( 2 ).length; // get the binary length of the largest index.
	const templateBinary = "0".repeat( maxBinaryLength ); // create a template binary of that length.
	const reversed = {};

	for ( let n = 0; n < N; ++n ) {
		let currBinary = n.toString( 2 ); // get binary value of current index.

		// prepend zeros from template to current binary. This makes binary values of all indices have the same length.
		currBinary = templateBinary.substr( currBinary.length ) + currBinary;

		currBinary = [ ...currBinary ].reverse().join( "" ); // reverse
		reversed[ n ] = parseInt( currBinary, 2 ); // convert to decimal
	}
	return reversed;
}
function GSUfftMultiply_( a, b ) {
	return {
		real: a.real * b.real - a.imag * b.imag,
		imag: a.real * b.imag + a.imag * b.real,
	};
}
function GSUfftAdd_( a, b ) {
	return {
		real: a.real + b.real,
		imag: a.imag + b.imag,
	};
}
function GSUfftSubtract_( a, b ) {
	return {
		real: a.real - b.real,
		imag: a.imag - b.imag,
	};
}
function GSUfftEuler_( kn, N ) {
	const x = -2 * Math.PI * kn / N;

	return {
		real: Math.cos( x ),
		imag: Math.sin( x ),
	};
}
function GSUfftConj_( a ) {
	a.imag *= -1;
	return a;
}
