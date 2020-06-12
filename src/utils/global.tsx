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

export function rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.union = function(x2, y2, width2, height2) {
		let right = x2 + width2;
		let bottom = y2 + height2;
		let x = Math.min(this.x, x2);
		let y = Math.min(this.y, y2);
		return new rect(x, y, Math.max(this.x + this.width, right) - x, Math.max(this.y + this.height, bottom) - y);
	};

	this.contains = function(x, y) {
		return this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height;
	};
}
