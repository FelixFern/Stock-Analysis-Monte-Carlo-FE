import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const fetchStock = (
	stock: string,
	criteria: string,
	start_date: string | never
) => {
	const payload = {
		stock: stock,
		criteria: criteria,
		start_date: start_date ?? "",
	};
	return axios.post(`${API_URL}/get`, payload).then((res) => res.data);
};

export const simulation = (
	stock: string,
	criteria: string,
	start_date: string | never,
	n_sim: number,
	days: number
) => {
	const payload = {
		stock: stock,
		criteria: criteria,
		start_date: start_date ?? "",
		n_sim: n_sim,
		days: days,
	};
	return axios.post(`${API_URL}/simulate`, payload).then((res) => res.data);
};

export const simulateTrade = (
	stock: string,
	criteria: string,
	start_date: string | never,
	n_sim: number,
	days: number,
	optimal_trading_sequence = Array<any>,
	money: number,
	conf_level: number
) => {
	const payload = {
		stock: stock,
		criteria: criteria,
		start_date: start_date ?? "",
		n_sim: n_sim,
		days: days,
		optimal_trading_sequence: optimal_trading_sequence,
		money: money,
		conf_level: conf_level,
	};
	return axios.post(`${API_URL}/trade`, payload).then((res) => res.data);
};
