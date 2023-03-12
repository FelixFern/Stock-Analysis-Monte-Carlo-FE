import { Line, ResponsiveLine } from "@nivo/line";
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
			markers={[
				{
					axis: "y",
					value: 0,
					lineStyle: {
						stroke: "#838383",
						strokeWidth: 1,
						strokeDasharray: "4 4",
					},
				},
			]}
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
			axisTop={null}
			axisBottom={null}
			axisRight={null}
			axisLeft={{
				tickValues: ["+" + max, 0, min],
			}}
			theme={{
				textColor: "#FFFFFF",
				crosshair: {
					line: {
						stroke: "#FFFFFF",
						strokeWidth: 1,
						strokeOpacity: 0.35,
					},
				},
			}}
			enableGridX={false}
			enableGridY={false}
			enablePoints={false}
			useMesh={true}
			legends={[]}
		/>
	);
};

export default ChartContainer;
