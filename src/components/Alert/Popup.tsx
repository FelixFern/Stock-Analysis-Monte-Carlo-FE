import styles from "./popup.module.scss";
import React from "react";

function Popup({ popup, setPopup }: any) {
	if (popup.type == "success") {
		return (
			<div
				className={
					popup.state
						? [styles.pred, styles.popup_parent, styles.show].join(
								" "
						  )
						: [styles.pred, styles.popup_parent, styles.hide].join(
								" "
						  )
				}
			>
				<h2>Process done successfully</h2>
				<h2
					className={styles.close_btn}
					onClick={() => {
						setPopup(false);
						console.log(popup);
					}}
				>
					x
				</h2>
			</div>
		);
	} else if (popup.type == "failed") {
		return (
			<div
				className={
					popup.state
						? [styles.err, styles.popup_parent, styles.show].join(
								" "
						  )
						: [styles.err, styles.popup_parent, styles.hide].join(
								" "
						  )
				}
			>
				<h2>Process failed, please try again</h2>
				<h2
					className={styles.close_btn}
					onClick={() => {
						setPopup(false);
						console.log(popup);
					}}
				>
					x
				</h2>
			</div>
		);
	} else if (popup.type == "loading") {
		return (
			<div
				className={
					popup.state
						? [styles.popup_parent, styles.show].join(" ")
						: [styles.popup_parent, styles.hide].join(" ")
				}
			>
				<h2>Please wait the backend is working...</h2>
			</div>
		);
	} else {
		return <></>;
	}
}

export default Popup;
