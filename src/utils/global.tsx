export function decimalToHex(d: number) {
	var hex = Number(d).toString(16);
	hex = hex + '000000'.substr(0, 6 - hex.length);
	return hex;
}

export function getColorFromBGR(color: any) {
	let Red = 0x0000ff & color;
	Red = Red << 16;
	let Green = 0x00ff00 & color;
	let Blue = 0xff0000 & color;
	Blue = Blue >> 16;
	let v = 0x000000 | Red | Green | Blue;
	return decimalToHex(v);
}
