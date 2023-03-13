import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { useEffect, useState } from "react";
import { fetchStock } from "@/utils/api";
import moment from "moment";

type PriceData = {
	x: string;
	y: number;
};

export default function Home() {
	const [stock, setStock] = useState<string>("BBCA.JK");
	const [displayedData, setDisplayedData] = useState<any>();
	const [simulationData, setSimulationData] = useState<any>();

	useEffect(() => {
		fetchStock(stock, "Adj Close", "").then((data) => {
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
		});
	}, [stock]);

	const generateSimulation = () => {};

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
								<p>Stock</p>
								<h2>BBCA.JK</h2>
							</div>
							<div className={styles.button_container}>
								<div
									className={[
										styles.btn,
										styles.primary,
									].join(" ")}
									onClick={() => {}}
									role="button"
								>
									<p>Generate Simulation</p>
								</div>
								<div
									className={[
										styles.btn,
										styles.secondary,
									].join(" ")}
									onClick={() => {}}
									role="button"
								>
									<p>Simulate Trading</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.chart_container}>
							<h2>Historical Data</h2>
							<div className={styles.lineChart}>
								<ChartContainer
									data={displayedData}
								></ChartContainer>
							</div>
						</div>
						<div className={styles.simulation_list}>
							<h2>Simulation</h2>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
