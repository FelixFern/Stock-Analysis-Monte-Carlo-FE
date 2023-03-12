import { ResponsiveLine } from "@nivo/line";
import { useState } from "react";

type HistoricalData = {
	x: string;
	y: number;
};

type LineChartComponentProps = {
	data: Array<{
		id: string;
		color: string;
		data: Array<HistoricalData>;
	}>;
	timeInterval?: number;
};

const ChartContainer = ({ data }: LineChartComponentProps) => {
	const [max, setMax] = useState(
		Math.max(...data[0].data.map((o: HistoricalData) => o.y, 0))
	);
	const [min, setMin] = useState(
		Math.min(...data[0].data.map((o: HistoricalData) => o.y, 0))
	);

	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 30, right: 12, bottom: 40, left: 50 }}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				stacked: true,
				reverse: false,
			}}
			colors={{ datum: "color" }}
			curve="natural"
			theme={{
				textColor: "#FFFFFF",
				crosshair: {
					line: {
						stroke: "#FFFFFF",
						strokeWidth: 0.5,
						strokeOpacity: 0.1,
					},
				},
				grid: {
					line: {
						stroke: "#ffffff",
						strokeWidth: 0.5,
					},
				},
			}}
			axisBottom={{ tickPadding: 5 }}
			enableGridX={false}
			enablePoints={false}
			useMesh={true}
			legends={[]}
		/>
	);
};

export default ChartContainer;
