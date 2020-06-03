import * as React from 'react';
import * as CSS from 'csstype';
import * as d3 from 'd3';
import { decimalToHex } from '../utils/global';

class TextObject extends React.Component<any, any> {
	public static defaultProps: any;
	constructor(props: any) {
		super(props);

		this.state = {
			textSize: null
		};
	}

	calculateTextSize = () => {
		let selection = d3.select<any, any>(this.refs.text);
		let size = selection.node().getBBox();

		this.setState({ textSize: size });
	};

	getTextWidth = () => {
		const { textSize } = this.state;

		return textSize ? textSize.width : 0;
	};

	getTextHeight = () => {
		const { textSize } = this.state;

		return textSize ? textSize.height : 0;
	};

	getTextAlign = (justify: string) => {
		let textAlign = 'start';
		switch (justify) {
			case 'L':
				textAlign = 'left';
				break;
			case 'R':
				textAlign = 'right';
				break;
			case 'C':
				textAlign = 'center';
				break;
			default:
				textAlign = 'start';
				break;
		}

		return textAlign;
	};

	public render() {
		const { Id, Name, Location, FontObj, TextColor, Justify } = this.props.textObject;

		const filter = `url(#${Id})`;
		const fontWeight = FontObj.Bold === 0 ? 'normal' : 'bold';
		const fontStyle = FontObj.Italic === 0 ? 'normal' : 'italic';
		const textAlign = this.getTextAlign(Justify);

		const style: CSS.Properties<string | number | React.ReactText> = {
			fontFamily: `${FontObj.FaceName}`,
			fontSize: `${1.5 * FontObj.Size}`,
			fill: `${decimalToHex(TextColor)}`,
			fontWeight: fontWeight,
			fontStyle: `${fontStyle}`,
			textAlign: textAlign as CSS.TextAlignProperty
		};

		return (
			<g>
				<text x={Location.X} y={Location.Y} style={style} ref="text" filter={filter}>
					{Name}
				</text>
			</g>
		);
	}
}

export default TextObject;
