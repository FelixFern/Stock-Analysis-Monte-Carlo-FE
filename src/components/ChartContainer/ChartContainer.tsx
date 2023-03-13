import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";

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
	const [ticks, setTicks] = useState<any>([]);

	useEffect(() => {
		const temp: any = [];
		data[0].data.map((val, index) => {
			if (index % 50 === 0) {
				temp.push(val.x);
			}
		});
		setTicks([...temp]);
	}, []);

	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 30, right: 12, bottom: 40, left: 50 }}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				reverse: false,
			}}
			colors={{ datum: "color" }}
			theme={{
				textColor: "#FFFFFF",
				crosshair: {
					line: {
						stroke: "#FFFFFF",
						strokeWidth: 2,
						strokeOpacity: 0.5,
					},
				},
				grid: {
					line: {
						stroke: "#ffffff",
						strokeWidth: 0.5,
					},
				},
			}}
			axisBottom={{
				tickValues: ticks,
			}}
			enableGridX={false}
			enablePoints={false}
			useMesh={true}
			legends={[]}
			enableSlices="x"
			sliceTooltip={({ slice }) => {
				return (
					<div
						style={{
							padding: "8px 10px",
							border: "1px solid #ccc",
							borderRadius: "5px",
							backgroundColor: "#272727",
						}}
					>
						{slice.points.map((point) => (
							<>
								<div
									key={point.id}
									style={{
										padding: "3px 0",
									}}
								>
									<strong
										style={{
											color: "#FFFFFF",
										}}
									>
										{point.data.xFormatted}
									</strong>
								</div>
							</>
						))}
						{slice.points.map((point) => (
							<>
								<div
									key={point.id}
									style={{
										padding: "3px 0",
									}}
								>
									<strong
										style={{
											color: point.color,
										}}
									>
										{point.data.yFormatted}
									</strong>
								</div>
							</>
						))}
					</div>
				);
			}}
		/>
	);
};

export default ChartContainer;
