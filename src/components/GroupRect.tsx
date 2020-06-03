import * as React from 'react';
import * as CSS from 'csstype';
import { GroupObject } from '../interface/map';
import { getColorFromBGR } from '../utils/global';

export default function GroupRect(props: IGroupRectProps) {
	const { strText, left, right, top, bottom, fontData, TextColor, groupbackColor } = props.groupObject;
	const fontWeight = fontData.Bold === 0 ? 'normal' : 'bold';
	const fontStyle = fontData.Italic === 0 ? 'normal' : 'italic';
	const rectFill = `#${getColorFromBGR(groupbackColor)}`;
	const style: CSS.Properties<string | number | React.ReactText> = {
		fontFamily: `${fontData.FaceName}`,
		fontSize: `${1.5 * fontData.Size}`,
		fill: `${getColorFromBGR(TextColor)}`,
		fontWeight: fontWeight,
		fontStyle: `${fontStyle}`
	};

	return (
		<g>
			<rect
				x={left}
				y={top}
				width={right - left}
				height={bottom - top}
				rx={15}
				ry={15}
				strokeDasharray="15 5 5 5"
				stroke="black"
				strokeWidth="1"
				fill={rectFill}
			/>
			<text x={left + (right - left) / 4} y={top + 20} style={style}>
				{strText}
			</text>
		</g>
	);
}

interface IGroupRectProps {
	groupObject: GroupObject;
}
