"use strict";

function ___( val, whatIf, ...args ) {
	if ( !_GSUcheckType( val, whatIf, ...args ) ) {
		console.error( `type error: ${ val } should be "${ whatIf }"`, args );
	}
}

function _GSUcheckType( val, whatIf, ...args ) {
	switch ( whatIf ) {
		case "oneOf": return args[ 0 ].includes( val );
		case "number": return GSUisNum( val );
		case "integer": return GSUisInt( val );
		case "number0+": return GSUisNum( val ) && GSUmathInRange( val, 0, Infinity );
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
