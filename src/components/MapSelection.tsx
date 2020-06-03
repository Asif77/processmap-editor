import * as React from 'react';

class MapSelection extends React.Component<IMapSelectionProps> {
	render() {
		const { height, x, y, width } = this.props;
		const scaleX = width > 0 ? 1 : -1;
		const scaleY = height > 0 ? 1 : -1;

		return (
			<rect
				id="rect"
				transform={`translate(${x} ${y}) scale(${scaleX} ${scaleY})`}
				//x={x}
				//y={y}
				height={Math.abs(height)}
				style={{
					fill: 'transparent',
					stroke: 'gray',
					strokeDasharray: '5 5',
					strokeWidth: 1
				}}
				width={Math.abs(width)}
			/>
		);
	}
}

export default MapSelection;

interface IMapSelectionProps {
	x: number;
	y: number;
	height: number;
	width: number;
}
