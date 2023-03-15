import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { useEffect, useState } from "react";
import { fetchStock, simulateTrade, simulation } from "@/utils/api";
import moment from "moment";
import Popup from "@/components/Alert/Popup";

type PriceData = {
	x: string;
	y: number;
};

export default function Home() {
	const [popup, setPopup] = useState<any>({ state: false, type: "" });

	const [stock, setStock] = useState<string>("BBCA.JK");
	const [displayedData, setDisplayedData] = useState<any>();
	const [startDate, setStartDate] = useState<any>("2021-01-01");
	const [numOfSimulation, setNumOfSimulation] = useState<number>(500);
	const [simulationDays, setSimulationDays] = useState<number>(60);
	const [simulationData, setSimulationData] = useState<any>();
	const [balance, setBalance] = useState<number>(0);
	const [showTradingSeq, setShowTradingSeq] = useState<boolean>(false);
	const [tradingSimData, setTradingSimData] = useState<any>();
	const [confidenceLevel, setConfidenceLevel] = useState<number>(95);

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

	const curr_formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "IDR",
	});

	const handleGenerateStock = () => {
		setPopup({ state: true, type: "loading" });

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
				setPopup({ state: true, type: "success" });
				setTimeout(() => {
					setPopup({ state: false, type: "success" });
				}, 3000);
			})
			.catch((err) => {
				console.error(err);
				setPopup({ state: true, type: "failed" });
				setTimeout(() => {
					setPopup({ state: false, type: "failed" });
				}, 3000);
			});
	};

	const handleGenerateSimulation = () => {
		setSimulationData(null);
		setTradingSimData(null);
		setPopup({ state: true, type: "loading" });
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
				setPopup({ state: true, type: "success" });
				setTimeout(() => {
					setPopup({ state: false, type: "success" });
				}, 3000);
			})
			.catch((err) => {
				console.error(err);
				setPopup({ state: true, type: "failed" });
				setTimeout(() => {
					setPopup({ state: false, type: "failed" });
				}, 3000);
			});
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
						x: val,
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

	const handleSimulateTrade = () => {
		setTradingSimData(() => null);
		setPopup({ state: true, type: "loading" });
		if (confidenceLevel <= 100 && confidenceLevel >= 0) {
			simulateTrade(
				stock,
				"Adj Close",
				startDate,
				numOfSimulation,
				simulationDays,
				simulationData.optimal_trading_sequence,
				balance,
				confidenceLevel
			)
				.then((res) => {
					setTradingSimData(() => res);
					console.log(res);
					setPopup({ state: true, type: "success" });
					setTimeout(() => {
						setPopup({ state: false, type: "success" });
					}, 3000);
				})
				.catch((err) => {
					setPopup({ state: true, type: "failed" });
					setTimeout(() => {
						setPopup({ state: false, type: "failed" });
					}, 3000);
				});
		} else {
			setPopup({ state: true, type: "failed" });
			setTimeout(() => {
				setPopup({ state: false, type: "failed" });
			}, 3000);
		}
	};

	if (!displayedData) {
		return (
			<>
				<>Loading...</>
			</>
		);
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
			<div className={styles.disclaimer}>
				<h1>
					Stock Analysis and Simulation <br></br>
				</h1>
				<h3>by Felix Fernando and Moch Nabil Farras</h3>
				<p>
					Please open this page on a device with a{" "}
					<span className={styles.accent}>larger screen</span>
				</p>
			</div>
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
								<input
									type="text"
									name="stock"
									className={styles.custom_input}
									onChange={(e) => setStock(e.target.value)}
									value={stock}
								/>
							</div>
							<div className={styles.subcontainer}>
								<p className={styles.title}>Start Date</p>
								<input
									type="date"
									name="date"
									className={styles.custom_input}
									value={startDate}
									onChange={(e) => {
										setStartDate(e.target.value);
									}}
								/>
							</div>
							<div
								className={[styles.btn, styles.primary].join(
									" "
								)}
								onClick={() => {
									handleGenerateStock();
								}}
								role="button"
							>
								<p>Regenerate Chart</p>
							</div>

							<div className={styles.divider}></div>

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
								className={[styles.btn, styles.secondary].join(
									" "
								)}
								onClick={() => {
									handleGenerateSimulation();
								}}
								role="button"
							>
								<p>Generate Simulation</p>
							</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.subsection}>
							<div className={styles.chart_container}>
								<h3>
									{isDisplayingSim
										? `Showing Simulation - ${
												selectedSim + 1
										  }`
										: "Historical Data"}
								</h3>
								<div className={styles.lineChart}>
									<ChartContainer
										data={displayedData}
									></ChartContainer>
								</div>
							</div>
							<div className={styles.t_simulation_stats}>
								<div className={styles.subcontainer}>
									<h3 className={styles.sub_title}>
										Trading Simulation
									</h3>
									<div className={styles.simulate_trading}>
										<div className={styles.input_container}>
											<p className={styles.title}>
												Balance :{" "}
											</p>
											<input
												type="number"
												name="balance"
												className={styles.custom_input}
												onChange={(e) =>
													setBalance(
														parseFloat(
															e.target.value
														)
													)
												}
												value={balance}
											/>
										</div>
										<div className={styles.input_container}>
											<p className={styles.title}>
												Confidence Level (%) :{" "}
											</p>
											<input
												type="number"
												name="balance"
												className={styles.custom_input}
												onChange={(e) =>
													setConfidenceLevel(
														parseFloat(
															e.target.value
														)
													)
												}
												value={confidenceLevel}
											/>
										</div>
									</div>
									<div
										className={[
											styles.btn,
											styles.secondary,
										].join(" ")}
										onClick={() => {
											handleSimulateTrade();
										}}
										role="button"
									>
										<p>Simulate Trading</p>
									</div>
									<h3 className={styles.sub_title}>
										Simulation Stats
									</h3>
									{tradingSimData ? (
										<div className={styles.stats}>
											<p>
												Win:{" "}
												<span className={styles.green}>
													{tradingSimData
														? parseFloat(
																tradingSimData
																	.performance
																	.win
														  ).toFixed(2)
														: "-"}
													%
												</span>
											</p>
											<p>
												Loss Rate:{" "}
												<span className={styles.red}>
													{tradingSimData
														? parseFloat(
																tradingSimData
																	.performance
																	.loss
														  ).toFixed(2)
														: "-"}
													%
												</span>
											</p>
											<p>
												Best Win{" "}
												<span
													className={styles.links}
													role="button"
													onClick={() => {
														diplaySimulation(
															tradingSimData
																.performance
																.maximum.profit
																.simulation
														);
													}}
												>
													(Simulation -{" "}
													{tradingSimData.performance
														.maximum.profit
														.simulation + 1}
													)
												</span>
												:{" "}
												<span className={styles.green}>
													{tradingSimData
														? parseFloat(
																tradingSimData
																	.performance
																	.maximum
																	.profit
																	.percentage
														  ).toFixed(2)
														: "-"}
													%
												</span>
											</p>
											<p>
												Best Loss{" "}
												<span
													className={styles.links}
													role="button"
													onClick={() => {
														diplaySimulation(
															tradingSimData
																.performance
																.maximum.loss
																.simulation
														);
													}}
												>
													(Simulation -{" "}
													{tradingSimData.performance
														.maximum.loss
														.simulation + 1}
													)
												</span>
												:{" "}
												<span className={styles.red}>
													{tradingSimData
														? parseFloat(
																tradingSimData
																	.performance
																	.maximum
																	.loss
																	.percentage
														  ).toFixed(2)
														: "-"}
													%
												</span>
											</p>
											<p>
												Value at Risk:{" "}
												<span
													className={
														tradingSimData
															.performance.maximum
															.var >= 0
															? styles.green
															: styles.red
													}
												>
													{curr_formatter.format(
														tradingSimData
															.performance.maximum
															.var
													)}
												</span>
											</p>
										</div>
									) : (
										<p className={styles.grey}>
											Start trading simulation to generate
											stats
										</p>
									)}
								</div>
								<div className={styles.subcontainer}>
									<div className={styles.optimal_trading}>
										<h3 className={styles.sub_title}>
											Optimal Trading Sequence
										</h3>
										{simulationData ? (
											<div
												className={
													styles.trading_sequence
												}
											>
												{simulationData.optimal_trading_sequence.map(
													(
														seq: any,
														index: number
													) => {
														return (
															<div
																className={`${
																	styles.sequence
																} ${
																	seq.decision ===
																	0
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
										) : (
											<p className={styles.grey}>
												Start simulation to generate
												data
											</p>
										)}
										<h3 className={styles.note_title}>
											Note :
										</h3>
										<div className={styles.sequence_note}>
											<div>
												<div
													className={[
														styles.sequence,
														styles.hold,
													].join(" ")}
												>
													0
												</div>
												Hold
											</div>
											<div>
												<div
													className={[
														styles.sequence,
														styles.sell,
													].join(" ")}
												>
													1
												</div>
												Sell
											</div>
											<div>
												<div
													className={[
														styles.sequence,
														styles.buy,
													].join(" ")}
												>
													2
												</div>
												Hold
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.simulation_list}>
							<div className={styles.header}>
								<h3 className={styles.sub_title}>Simulation</h3>
								<div
									className={[
										styles.btn,
										styles.secondary,
									].join(" ")}
									onClick={() => {
										setShowTradingSeq((show) => !show);
									}}
									role="button"
								>
									<p>
										{showTradingSeq ? "Show" : "Hide"}{" "}
										Trading Sequence
									</p>
								</div>
							</div>
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
														{tradingSimData ? (
															<div>
																<h4>
																	Stats with
																	Optimal
																	Trading
																	Sequence
																</h4>
																<p>
																	Profit /
																	Loss:{" "}
																	<span
																		className={
																			tradingSimData
																				.data[
																				index
																			]
																				.profit >=
																			0
																				? styles.green
																				: styles.red
																		}
																	>
																		{parseFloat(
																			tradingSimData
																				.data[
																				index
																			]
																				.profit
																		).toFixed(
																			2
																		)}
																		%
																	</span>
																</p>
																<p>
																	Final
																	Balance:{" "}
																	<span
																		className={
																			styles.accent
																		}
																	>
																		{curr_formatter.format(
																			tradingSimData
																				.data[
																				index
																			]
																				.final_balance
																		)}
																	</span>
																</p>
															</div>
														) : (
															<></>
														)}
														{!showTradingSeq ? (
															<>
																<h4>
																	Trading
																	Sequence
																</h4>
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
															</>
														) : (
															<></>
														)}
													</div>
												);
											}
										)}
									</div>
								) : (
									<p className={styles.grey}>
										Start simulation to generate data
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
			<Popup popup={popup} setPopup={setPopup}></Popup>
		</>
	);
}
