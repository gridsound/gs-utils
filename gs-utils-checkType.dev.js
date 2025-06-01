"use strict";

let _GSUcheckType_lastError = null;

function ___( val, whatIf, ...args ) {
	if ( _GSUcheckType( val, whatIf, ...args ) ) {
		_GSUcheckType_lastError = null;
	} else {
		_GSUcheckType_lastError = whatIf;
		throw new Error( `\`${ val }\` (typeof ${ typeof val }) should be "${ whatIf }" ${ args.join( ", " ) }` );
	}
}

function _GSUcheckType( val, whatIf, ...args ) {
	switch ( whatIf ) {
		case "oneOf": return args[ 0 ].includes( val );
		case "integer": return GSUisInt( val );
		case "integer+": return GSUisInt( val ) && val > 0;
		case "integer-": return GSUisInt( val ) && val < 0;
		case "integer0+": return GSUisInt( val ) && val >= 0;
		case "integer0-": return GSUisInt( val ) && val <= 0;
		case "number": return GSUisNum( val );
		case "number+": return GSUisNum( val ) && val > 0;
		case "number-": return GSUisNum( val ) && val < 0;
		case "number0+": return GSUisNum( val ) && val >= 0;
		case "number0-": return GSUisNum( val ) && val <= 0;
		case "numberBetween": return GSUisNum( val ) && GSUmathInRange( val, ...args );
		case "integerBetween": return GSUisInt( val ) && GSUmathInRange( val, ...args );
		case "string": return GSUisStr( val );
		case "function": return GSUisFun( val );
		case "array": return GSUisArr( val );
		case "object": return GSUisObj( val ) && !GSUisArr( val );
		case "arrayOfNumber": return GSUisArr( val ) && val.every( GSUisNum );
		case "arrayOfInteger": return GSUisArr( val ) && val.every( GSUisInt );
	}
	return false;
}
