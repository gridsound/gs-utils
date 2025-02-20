"use strict";

// memoization of the reversal of different lengths.
var memoizedReversal = {};
var memoizedZeroBuffers = {}

let utils_constructComplexArray = function(signal){
  var complexSignal = {};

  complexSignal.real = (signal.real === undefined) ? signal.slice() : signal.real.slice();

  var bufferSize = complexSignal.real.length;

  if(memoizedZeroBuffers[bufferSize] === undefined){
    memoizedZeroBuffers[bufferSize] = Array.apply(null, Array(bufferSize)).map(Number.prototype.valueOf, 0);
  }

  complexSignal.imag = memoizedZeroBuffers[bufferSize].slice();

  return complexSignal;
}

let utils_bitReverseArray = function(N){
  if(memoizedReversal[N] === undefined){
    let maxBinaryLength = (N - 1).toString(2).length; //get the binary length of the largest index.
    let templateBinary = '0'.repeat(maxBinaryLength); //create a template binary of that length.
    let reversed = {};
    for(let n = 0; n < N; n++){
      let currBinary = n.toString(2); //get binary value of current index.

      //prepend zeros from template to current binary. This makes binary values of all indices have the same length.
      currBinary = templateBinary.substr(currBinary.length) + currBinary;

      currBinary = [...currBinary].reverse().join(''); //reverse
      reversed[n] = parseInt(currBinary, 2); //convert to decimal
    }
    memoizedReversal[N] = reversed; //save
  }
  return memoizedReversal[N];
}

// complex multiplication
let utils_multiply = function(a, b){
  return {
          'real': a.real * b.real - a.imag * b.imag,
          'imag': a.real * b.imag + a.imag * b.real
        };
}

// complex addition
let utils_add = function(a, b){
  return {
          'real': a.real + b.real,
          'imag': a.imag + b.imag
        };
}

// complex subtraction
let utils_subtract = function(a, b){
  return {
            'real': a.real - b.real,
            'imag': a.imag - b.imag
        };
}

// euler's identity e^x = cos(x) + sin(x)
let utils_euler = function(kn, N){
  let x = -2 * Math.PI * kn / N;
  return {'real': Math.cos(x), 'imag': Math.sin(x)};
}

// complex conjugate
let utils_conj = function(a){
  a.imag *= -1;
  return a;
}

let fft = function( signal ) {
  let complexSignal = {};

  if(signal.real === undefined || signal.imag === undefined){
    complexSignal = utils_constructComplexArray(signal);
  }
  else {
    complexSignal.real = signal.real.slice();
    complexSignal.imag = signal.imag.slice();
  }

  const N = complexSignal.real.length;
  const logN = Math.log2(N);

  if(Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

  if(complexSignal.real.length != complexSignal.imag.length){
    throw new Error('Real and imaginary components must have the same length.');
  }

  const bitReversedIndices = utils_bitReverseArray(N);

  // sort array
  let ordered = {
    'real': [],
    'imag': []
  };

  for(let i = 0; i < N; i++){
    ordered.real[bitReversedIndices[i]] = complexSignal.real[i];
    ordered.imag[bitReversedIndices[i]] = complexSignal.imag[i];
  }

  for(let i = 0; i < N; i++){
    complexSignal.real[i] = ordered.real[i];
    complexSignal.imag[i] = ordered.imag[i];
  }
  // iterate over the number of stages
  for(let n = 1; n <= logN; n++){
    let currN = Math.pow(2, n);

    // find twiddle factors
    for(let k = 0; k < currN / 2; k++){
      let twiddle = utils_euler(k, currN);

      // on each block of FT, implement the butterfly diagram
      for(let m = 0; m < N / currN; m++){
        let currEvenIndex = (currN * m) + k;
        let currOddIndex = (currN * m) + k + (currN / 2);

        let currEvenIndexSample = {
          'real': complexSignal.real[currEvenIndex],
          'imag': complexSignal.imag[currEvenIndex],
        };
        let currOddIndexSample = {
          'real': complexSignal.real[currOddIndex],
          'imag': complexSignal.imag[currOddIndex],
        };

        let odd = utils_multiply(twiddle, currOddIndexSample);

        let subtractionResult = utils_subtract(currEvenIndexSample, odd);
        complexSignal.real[currOddIndex] = subtractionResult.real;
        complexSignal.imag[currOddIndex] = subtractionResult.imag;

        let additionResult = utils_add(odd, currEvenIndexSample);
        complexSignal.real[currEvenIndex] = additionResult.real;
        complexSignal.imag[currEvenIndex] = additionResult.imag;
      }
    }
  }
  return complexSignal;
}

// complex to real ifft
let ifft = function(signal){

  if(signal.real === undefined || signal.imag === undefined){
    throw new Error("IFFT only accepts a complex input.")
  }

  const N = signal.real.length;

  var complexSignal = {
    'real': [],
    'imag': [],
  };

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for(let i = 0; i < N; i++){
    let currentSample = {
      'real': signal.real[i],
      'imag': signal.imag[i]
    };

    let conjugateSample = utils_conj(currentSample);
    complexSignal.real[i] = conjugateSample.real;
    complexSignal.imag[i] = conjugateSample.imag;
  }

  //compute
  let X = fft(complexSignal);

  //normalize
  complexSignal.real = X.real.map((val) => {
    return val / N;
  });

  complexSignal.imag = X.imag.map((val) => {
    return val / N;
  });

  return complexSignal;
}
