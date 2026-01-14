"use strict";

let GSUcheckType_lastError = null;

function GSUcheckType_isArrNum( arr ) {
	return arr instanceof Float32Array || ( GSUisArr( arr ) && arr.every( GSUisNum ) );
}
function GSUcheckType_isArrInt( arr ) {
	return GSUisArr( arr ) && arr.every( GSUisInt );
}
function GSUcheckType( val, whatIf, ...args ) {
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
		case "arrayOfNumber":  if ( !GSUcheckType_isArrNum( val )      ) { return false; } break;
		case "arrayOfInteger": if ( !GSUcheckType_isArrInt( val )      ) { return false; } break;
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

function ___( val, whatIf, ...args ) {
	if ( GSUcheckType( val, whatIf, ...args ) ) {
		GSUcheckType_lastError = null;
	} else {
		const valStr = GSUisNum( val ) || GSUisNaN( val ) ? val : JSON.stringify( val );

		GSUcheckType_lastError = whatIf;
		throw new Error( `\`${ valStr }\` (typeof ${ typeof val }) should be "${ whatIf }" ${ args.join( ", " ) }` );
	}
}
