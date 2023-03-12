import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import ChartContainer from "@/components/ChartContainer/ChartContainer";

const data = [
	{
		id: "Investment Data",
		color: "hsl(264, 72%, 51%)",
		data: [
			{
				x: "1/1/2023",
				y: 25,
			},
			{
				x: "2/1/2023",
				y: 1,
			},
			{
				x: "3/1/2023",
				y: -2,
			},
			{
				x: "4/1/2023",
				y: 5,
			},
			{
				x: "5/1/2023",
				y: -10,
			},
			{
				x: "6/1/2023",
				y: -8,
			},
			{
				x: "7/1/2023",
				y: -9,
			},
			{
				x: "8/1/2023",
				y: 8,
			},
			{
				x: "9/1/2023",
				y: 10,
			},
			{
				x: "10/1/2023",
				y: 8,
			},
			{
				x: "11/1/2023",
				y: 7,
			},
			{
				x: "12/1/2023",
				y: 6,
			},
		],
	},
];
export default function Home() {
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
				</div>
				<div className={styles.lineChart}>
					<ChartContainer data={data}></ChartContainer>
				</div>
			</main>
		</>
	);
}
