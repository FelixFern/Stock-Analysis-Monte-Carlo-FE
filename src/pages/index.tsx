import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { useEffect, useState } from "react";
import { fetchStock, simulation } from "@/utils/api";
import moment from "moment";

type PriceData = {
	x: string;
	y: number;
};

export default function Home() {
	const [stock, setStock] = useState<string>("BBCA.JK");
	const [displayedData, setDisplayedData] = useState<any>();
	const [startDate, setStartDate] = useState<any>("");
	const [numOfSimulation, setNumOfSimulation] = useState<number>(100);
	const [simulationDays, setSimulationDays] = useState<number>(60);
	const [simulationData, setSimulationData] = useState<any>();

	const [selectedSim, setSelectedSim] = useState<number>(0);
	const [isDisplayingSim, setIsDisplayingSim] = useState<boolean>(false);

	useEffect(() => {
		fetchStock(stock, "Adj Close", startDate)
			.then((data) => {
				let price_data: PriceData[] = [];
				data.date.map((val: any, index: number) => {
					price_data.push({
						// x: new Date(price.timestamp).toLocaleString().split(',')[0],
						x: moment(val).format("DD/MM/YYYY"),
						y: data.values[index] ?? 0,
					});
				});
				setDisplayedData([
					{
						id: stock,
						color: "#5ED8FF",
						data: [...price_data],
					},
				]);
			})
			.catch((err) => console.error(err));
	}, []);

	const generateStock = () => {
		fetchStock(stock, "Adj Close", startDate)
			.then((data) => {
				let price_data: PriceData[] = [];
				data.date.map((val: any, index: number) => {
					price_data.push({
						// x: new Date(price.timestamp).toLocaleString().split(',')[0],
						x: moment(val).format("DD/MM/YYYY"),
						y: data.values[index] ?? 0,
					});
				});
				setIsDisplayingSim(false);
				setDisplayedData([
					{
						id: stock,
						color: "#5ED8FF",
						data: [...price_data],
					},
				]);
			})
			.catch((err) => console.error(err));
	};

	const generateSimulation = () => {
		setSimulationData(null);
		simulation(
			stock,
			"Adj Close",
			startDate,
			numOfSimulation,
			simulationDays
		)
			.then((data) => {
				setSimulationData(data);
				console.log(data);
			})
			.catch((err) => console.error(err));
	};

	const diplaySimulation = (displayed_sim: number) => {
		setSelectedSim(displayed_sim);
		setIsDisplayingSim(true);
		if (simulationData) {
			let price_data: PriceData[] = [];
			simulationData.data[displayed_sim].data.date.map(
				(val: any, index: number) => {
					price_data.push({
						// x: new Date(price.timestamp).toLocaleString().split(',')[0],
						x: moment(val).format("DD/MM/YYYY"),
						y:
							simulationData.data[displayed_sim].data.price[
								index
							] ?? 0,
					});
				}
			);
			setDisplayedData([
				{
					id: stock,
					color: "#5ED8FF",
					data: [...price_data],
				},
			]);
		} else {
			alert("No simulation data yet");
		}
	};

	if (!displayedData) {
		return <>Loading...</>;
	}
	return (
		<>
			<Head>
				<title>Stock Analysis and Simulation</title>
				<meta
					name="description"
					content="Stock Analysis and Simulation"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.container}>
				<div className={styles.content_container}>
					<div className={styles.title}>
						<h1>Stock Analysis and Simulation with Monte Carlo</h1>
						<p>a Project by Felix Fernando and Moch Nabil Farras</p>
					</div>
					<div className={styles.configuration_container}>
						<div className={styles.configurations}>
							<div className={styles.subcontainer}>
								<p className={styles.title}>Stock</p>
								<h2>BBCA.JK</h2>
							</div>
							<div className={styles.subcontainer}>
								<p className={styles.title}>Start Date</p>
								<input
									type="date"
									name="date"
									className={styles.custom_input}
									onChange={(e) => {
										setStartDate(e.target.value);
										console.log(e.target.value);
									}}
								/>
							</div>
							<div className={styles.subcontainer}>
								<p className={styles.title}>
									Number of Simulation
								</p>
								<input
									type="number"
									name="num_of_sim"
									className={styles.custom_input}
									onChange={(e) =>
										setNumOfSimulation(
											parseInt(e.target.value)
										)
									}
									value={numOfSimulation}
								/>
							</div>
							<div className={styles.subcontainer}>
								<p className={styles.title}>Simulation Days</p>
								<input
									type="number"
									name="days_of_sim"
									className={styles.custom_input}
									onChange={(e) =>
										setSimulationDays(
											parseInt(e.target.value)
										)
									}
									value={simulationDays}
								/>
							</div>
							<div
								className={[styles.btn, styles.primary].join(
									" "
								)}
								onClick={() => {
									generateStock();
								}}
								role="button"
							>
								<p>Regenerate Chart</p>
							</div>
						</div>
						<div className={styles.button_container}>
							<div
								className={[styles.btn, styles.primary].join(
									" "
								)}
								onClick={() => {
									generateSimulation();
								}}
								role="button"
							>
								<p>Generate Simulation</p>
							</div>
							<div
								className={[styles.btn, styles.secondary].join(
									" "
								)}
								onClick={() => {}}
								role="button"
							>
								<p>Simulate Trading</p>
							</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.chart_container}>
							<h3>
								{isDisplayingSim
									? `Showing Simulation - ${selectedSim + 1}`
									: "Historical Data"}
							</h3>
							<div className={styles.lineChart}>
								<ChartContainer
									data={displayedData}
								></ChartContainer>
							</div>
						</div>
						<div className={styles.simulation_list}>
							<h3 className={styles.sub_title}>Simulation</h3>
							<div className={styles.simulation}>
								{simulationData ? (
									<div>
										{simulationData.data.map(
											(val: any, index: number) => {
												return (
													<div
														key={val.simulation}
														className={
															styles.simulation_card
														}
														onClick={() =>
															diplaySimulation(
																index
															)
														}
													>
														<h3>
															Simulation -{" "}
															{val.simulation}
														</h3>
														<p>Trading Sequence</p>
														<div
															className={
																styles.trading_sequence
															}
														>
															{val.trading_sequence.map(
																(
																	seq: number,
																	index: number
																) => {
																	return (
																		<div
																			className={`${
																				styles.sequence
																			} ${
																				seq ===
																				0
																					? styles.hold
																					: seq ===
																					  1
																					? styles.sell
																					: styles.buy
																			}`}
																			key={
																				index
																			}
																		>
																			{
																				seq
																			}
																		</div>
																	);
																}
															)}
														</div>
													</div>
												);
											}
										)}
									</div>
								) : (
									<p>No Data</p>
								)}
							</div>
							{simulationData ? (
								<div className={styles.optimal_trading}>
									<h3 className={styles.sub_title}>
										Optimal Trading Sequence
									</h3>
									<div className={styles.trading_sequence}>
										{simulationData.optimal_trading_sequence.map(
											(seq: any, index: number) => {
												return (
													<div
														className={`${
															styles.sequence
														} ${
															seq.decision === 0
																? styles.hold
																: seq.decision ===
																  1
																? styles.sell
																: styles.buy
														}`}
														key={index}
													>
														{seq.decision}
													</div>
												);
											}
										)}
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
