"use strict";

const GSUonMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/u.test( navigator.userAgent );

// -----------------------------------------------------------------------------
function GSUnoop() {}
function GSUisNoop( fn ) {
	return !fn || fn === GSUnoop;
}

// -----------------------------------------------------------------------------
function GSUisObject( o ) {
	return o !== null && typeof o === "object";
}
function GSUisEmpty( o ) {
	for ( const a in o ) {
		return false;
	}
	return true;
}
function GSUisntEmpty( o ) {
	return !GSUisEmpty( o );
}

// -----------------------------------------------------------------------------
function GSUtrim2( str ) {
	return str ? str.trim().replace( /\s+/ug, " " ) : "";
}

// -----------------------------------------------------------------------------
function GSUisNum( n ) {
	return typeof n === "number" && !Number.isNaN( n );
}

// -----------------------------------------------------------------------------
function GSUeaseInCirc( n ) {
	return 1 - Math.sqrt( 1 - Math.pow( n, 2 ) );
}
function GSUeaseOutCirc( n ) {
	return Math.sqrt( 1 - Math.pow( n - 1, 2 ) );
}

// -----------------------------------------------------------------------------
function GSUroundNum( val, dec = 0 ) {
	return typeof val === "number"
		? +val.toFixed( dec )
		: val.map( n => +n.toFixed( dec ) );
}
function GSUclampNum( n, min, max ) {
	return (
		min < max
			? Math.max( min, Math.min( n || 0, max ) )
			: Math.max( max, Math.min( n || 0, min ) )
	);
}
function GSUsplitNums( str, del = " " ) {
	return str.split( del ).map( n => +n );
}

// -----------------------------------------------------------------------------
function GSUuuid() {
	const rnd = crypto.getRandomValues( new Uint8Array( 36 ) );
	const uuid = rnd.reduce( ( arr, n ) => {
		arr.push( ( n % 16 ).toString( 16 ) );
		return arr;
	}, [] );

	uuid[ 14 ] = "4";
	uuid[ 19 ] = ( 8 + rnd[ 19 ] % 4 ).toString( 16 );
	uuid[ 8 ] =
	uuid[ 13 ] =
	uuid[ 18 ] =
	uuid[ 23 ] = "-";
	return uuid.join( "" );
}

// -----------------------------------------------------------------------------
function GSUuniqueName( nameOri, arr ) {
	const name = GSUtrim2( nameOri );

	if ( arr.indexOf( name ) > -1 ) {
		const name2 = /-\d+$/u.test( name )
			? name.substr( 0, name.lastIndexOf( "-" ) ).trim()
			: name;
		const reg = new RegExp( `^${ name2 }-(\\d+)$`, "u" );
		const nb = arr.reduce( ( nb, str ) => {
			const res = reg.exec( str );

			return res ? Math.max( nb, +res[ 1 ] ) : nb;
		}, 1 );

		return `${ name2 }-${ nb + 1 }`;
	}
	return name;
}

// -----------------------------------------------------------------------------
function GSUplural( nb, word, s ) {
	const w = word[ word.length - 1 ] === "s"
		? word
		: `${ word }${ nb > 1 ? "s" : "" }`;
	const ws = s !== "'s"
		? w
		: `${ w }'${ w[ w.length - 1 ] === "s" ? "" : "s" }`;

	return `${ nb } ${ ws }`;
}

// -----------------------------------------------------------------------------
function GSUmapCallbacks( names, fns ) {
	const on = {};

	names.forEach( n => on[ n ] = GSUnoop );
	Object.assign( Object.seal( on ), fns );
	return Object.freeze( on );
}
