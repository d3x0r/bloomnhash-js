
const storages = [];

class BitReader {
       	entropy = null;

	constructor( bits ) {
		if( "number" === typeof bits ) {
			bits = new Uint8Array( ( (bits+7)/8)|0 );
		}
                this.entropy = bits;
	}

	hook( storage ) {
	}
	get(N) {
		const bit = this.entropy[N>>3] & ( 1 << (N&7)) ;
		if( bit ) return true; 
		return false;
	}
	set(N) {
		this.entropy[N>>3] |= ( 1 << (N&7)) ;
	}
	getBit(N) {
		const bit = this.entropy[N>>3] & ( 1 << (N&7)) ;
		if( bit ) return true; 
		return false;
	}
	setBit(N) {
		this.entropy[N>>3] |= ( 1 << (N&7)) ;
	}
	clearBit(N) {
		this.entropy[N>>3] &= ~( 1 << (N&7)) ;
	}

}

function encode( stringifier ){
	return `{e:${stringifier.stringify(this.entropy)}}`;
}
function decode(field,val){
	if( field === "e" ) this.entropy = val;
	//if( field === "a" ) this.available = val;
	//if( field === "u" ) this.used = val;
	if( field )
		return undefined;
	else {
		// val is storage instance
	}
	return this;
}


BitReader.hook = function( storage ){
	//console.log( "Encode decode works..." );
	if( !storages.find( s=>s===storage ) ) {
		//console.log( "Hooked into storage for bitreader..." );
		storage.addEncoders( [ { tag:"btr", p:BitReader, f:encode } ] );
		storage.addDecoders( [ { tag:"btr", p:BitReader, f:decode } ] );
		storages.push( storage );
	}
		
};

//module.exports = exports = bitReader;
export {BitReader};
