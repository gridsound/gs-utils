"use strict";

let _GSUcheckType_lastError = null;

function ___( val, whatIf, ...args ) {
	if ( _GSUcheckType( val, whatIf, ...args ) ) {
		_GSUcheckType_lastError = null;
	} else {
		const valStr = GSUisNum( val ) || GSUisNaN( val ) ? val : JSON.stringify( val );

		_GSUcheckType_lastError = whatIf;
		throw new Error( `\`${ valStr }\` (typeof ${ typeof val }) should be "${ whatIf }" ${ args.join( ", " ) }` );
	}
}

function _GSUcheckType( val, whatIf, ...args ) {
	const arr = whatIf.split( "-" );

	if (
		( val === 0         && arr.includes( "0"         ) ) ||
		( val === null      && arr.includes( "null"      ) ) ||
		( val === undefined && arr.includes( "undefined" ) ) ||
		( GSUisNaN( val )   && arr.includes( "NaN"       ) )
	) {
		return true;
	}
	switch ( arr[ 0 ] ) {
		case "oneOf":          return args[ 0 ].includes( val );
		case "objay":          if ( !GSUisObj( val )                    ) { return false; } break;
		case "array":          if ( !GSUisArr( val )                    ) { return false; } break;
		case "object":         if ( !GSUisObj( val ) || GSUisArr( val ) ) { return false; } break;
		case "string":         if ( !GSUisStr( val )                    ) { return false; } break;
		case "number":         if ( !GSUisNum( val )                    ) { return false; } break;
		case "integer":        if ( !GSUisInt( val )                    ) { return false; } break;
		case "function":       if ( !GSUisFun( val )                    ) { return false; } break;
		case "arrayOfNumber":  if ( !_GSUcheckType_isArrNum( val )      ) { return false; } break;
		case "arrayOfInteger": if ( !_GSUcheckType_isArrInt( val )      ) { return false; } break;
		case "element":        if ( !( val instanceof Element )         ) { return false; } break;
	}
	if (
		( arr.includes( "positive" ) && val <= 0 ) ||
		( arr.includes( "negative" ) && val >= 0 ) ||
		( arr.includes( "inRange" ) && !GSUmathInRange( val, ...args ) )
	) {
		return false;
	}
	return true;
}

function _GSUcheckType_isArrNum( arr ) {
	return arr instanceof Float32Array || ( GSUisArr( arr ) && arr.every( GSUisNum ) );
}
function _GSUcheckType_isArrInt( arr ) {
	return GSUisArr( arr ) && arr.every( GSUisInt );
}
