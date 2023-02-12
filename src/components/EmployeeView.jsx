import {
	query,
	where,
	getDocs,
	addDoc,
	updateDoc,
	doc,
} from "firebase/firestore";
import { dataCollection } from "../firebase/utils/functions";
import { useContext, useEffect, useRef, useState } from "react";
import { MenuContent } from "./StateContainer";
import React from "react";
import {
	MDBTable,
	MDBTableHead,
	MDBTableBody,
	MDBInput,
	MDBBtn,
	MDBIcon,
} from "mdb-react-ui-kit";
import styled from "styled-components";
import { NameLocation } from "./NameLocation";
import { NameIcon } from "./NameIcon";
import { db } from "../firebase/firebase";

const TableDiv = styled.div`
	width: 100%;
`;

const TablePack = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const UserHeader = styled.div`
display:flex;
justify-content: space-between;
	width: 100%;
	display: flex;
	height: 80px;
	margin-top: 10px;
	align-items: center;
	h2 {
		margin-right: 20px;
		font-size: 44px;
		font-weight: 700;
	}
	padding: 40px;
`;
const UserContent = styled.div`
	width: 100%;
	height: calc(100vh - 260px - 60px);
	padding: 40px;
	margin-top: 75px;
	overflow-y: auto;
`;
const currentWeek = function () {
	var options = { year: "numeric" };
	var now = new Date();
	var onejan = new Date(now.getFullYear(), 0, 1);
	var w = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() - 1) / 7);
	if (w < 10) w = "0" + w;
	return now.toLocaleString("en-US", options) + "-W" + w;
};

const initData = user => {
	const newData = {
		pn: 0,
		wt: 0,
		sr: 0,
		czw: 0,
		pt: 0,
		sn: 0,
		nd: 0,
		sum: 0,
		name: user.name + " " + user.lastName,
		userId: user.id,
		locationId: user.location_id,
		isApproved: false,
	};

	return newData;
};

export const EmployeeView = ({ user }) => {
	const context = useContext(MenuContent);
	const [data, setData] = useState(null);
	const [week, setWeek] = useState(currentWeek(data));
	const weekInput = useRef(null);
	const w = currentWeek();
	if (weekInput.current) weekInput.current.value = w == week ? w : week;
	useEffect(() => {
		getDocs(
			query(
				dataCollection,
				where("location_id", "==", user.location_id),
				where("user_id", "==", user.id),
				where("week", "==", week)
			)
		).then(querySnapshot => {
			const data = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			if (data.length == 0) {
				const ddd = initData(user);
				setData(ddd);
			} else {
				const ddd = {
					pn: data[0].pn,
					wt: data[0].wt,
					sr: data[0].sr,
					czw: data[0].czw,
					pt: data[0].pt,
					sn: data[0].sn,
					nd: data[0].nd,
					sum:
						data[0].pn +
						data[0].wt +
						data[0].sr +
						data[0].czw +
						data[0].pt +
						data[0].sn +
						data[0].nd,
					name: user.name + " " + user.lastName,
					userId: user.id,
					locationId: user.location_id,
					isApproved: data[0].isApproved,
				};
				setData(ddd);
			}
		});
	}, [week]);

	const handleChange = (id, day, e) => {
		const val = parseFloat(e.target.value);
		const error = isNaN(val) || val < 0;
		let sum = data.sum;
		if (!error)
			sum =
				data.pn * 1 +
				data.wt * 1 +
				data.sr * 1 +
				data.czw * 1 +
				data.pt * 1 +
				data.sn * 1 +
				data.nd * 1;

		setData({ ...data, [day]: e.target.value, sum: sum });

		console.log(data, e, id, day);
	};

	const handleKey = (id, day, e) => {
		let val = parseFloat(e.target.value);
		let error = isNaN(val) || val < 0;
		const old_sum = data.sum;
		const sum =
			data.pn * 1 +
			data.wt * 1 +
			data.sr * 1 +
			data.czw * 1 +
			data.pt * 1 +
			data.sn * 1 +
			data.nd * 1;
		if (e.target.value == "") {
			val = "";
			error = false;
		}
		setData({
			...data,
			[day]: error ? 0 : val,
			sum: isNaN(sum) ? old_sum : sum,
		});
	};

	const handleBlur = (id, day, e) => {
		if (e.target.value == "") setData({ ...data, [day]: 0 });
	};

	const handleSubmit = event => {
		alert("zapisano");
		event.preventDefault();
		getDocs(
			query(
				dataCollection,
				where("location_id", "==", user.location_id),
				where("user_id", "==", user.id),
				where("week", "==", week)
			)
		).then(querySnapshot => {
			const d = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			if (d.length == 0) {
				//insert
				addDoc(dataCollection, {
					isApproved: false,
					location_id: data.locationId,
					week: week,
					user_id: data.userId,
					pn: data.pn,
					wt: data.wt,
					sr: data.sr,
					czw: data.czw,
					pt: data.pt,
					sn: data.sn,
					nd: data.nd,
				});
			} else {
				console.log(d[0].id, data, user, week);
				updateDoc(doc(db, "Data", d[0].id), {
					isApproved: false,
					location_id: data.locationId,
					week: week,
					user_id: data.userId,
					pn: data.pn,
					wt: data.wt,
					sr: data.sr,
					czw: data.czw,
					pt: data.pt,
					sn: data.sn,
					nd: data.nd,
				});
			}
		});
	};

	return (
		<>
			{console.log(data, "week", week)}

			<form onSubmit={handleSubmit}>
                <UserHeader>
                
					<NameLocation user={user} />

					<MDBInput
						type="week"
						onChange={e => {
							setWeek(e.target.value);
						}}
						ref={weekInput}></MDBInput>
					<NameIcon user={user} />
				</UserHeader>
				<UserContent>
					<TablePack>
						<TableDiv>
							<MDBTable hover responsive>
								<MDBTableHead dark>
									<tr>
										<th scope="col">Employee</th>
										<th scope="col">Monday</th>
										<th scope="col">Tuesday</th>
										<th scope="col">Wednesday</th>
										<th scope="col">Thursday</th>
										<th scope="col">Friday</th>
										<th scope="col">Saturday</th>
										<th scope="col">Sunday</th>
										<th scope="col">Sum</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td>{data?.name}</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.pn : ""}
												onChange={e => handleChange(user.id, "pn", e)}
												onKeyDown={e => handleKey(user.id, "pn", e)}
												onKeyUp={e => handleKey(user.id, "pn", e)}
												onBlur={e => handleBlur(user.id, "pn", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.wt : ""}
												onChange={e => handleChange(user.id, "wt", e)}
												onKeyDown={e => handleKey(user.id, "wt", e)}
												onKeyUp={e => handleKey(user.id, "wt", e)}
												onBlur={e => handleBlur(user.id, "wt", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.sr : ""}
												onChange={e => handleChange(user.id, "sr", e)}
												onKeyDown={e => handleKey(user.id, "sr", e)}
												onKeyUp={e => handleKey(user.id, "sr", e)}
												onBlur={e => handleBlur(user.id, "sr", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.czw : ""}
												onChange={e => handleChange(user.id, "czw", e)}
												onKeyDown={e => handleKey(user.id, "czw", e)}
												onKeyUp={e => handleKey(user.id, "czw", e)}
												onBlur={e => handleBlur(user.id, "czw", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.pt : ""}
												onChange={e => handleChange(user.id, "pt", e)}
												onKeyDown={e => handleKey(user.id, "pt", e)}
												onKeyUp={e => handleKey(user.id, "pt", e)}
												onBlur={e => handleBlur(user.id, "pt", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.sn : ""}
												onChange={e => handleChange(user.id, "sn", e)}
												onKeyDown={e => handleKey(user.id, "sn", e)}
												onKeyUp={e => handleKey(user.id, "sn", e)}
												onBlur={e => handleBlur(user.id, "sn", e)}
											/>
										</td>
										<td>
											<MDBInput
												disabled={data ? data.isApproved : false}
												value={data ? data.nd : ""}
												onChange={e => handleChange(user.id, "nd", e)}
												onKeyDown={e => handleKey(user.id, "nd", e)}
												onKeyUp={e => handleKey(user.id, "nd", e)}
												onBlur={e => handleBlur(user.id, "nd", e)}
											/>
										</td>
										<td>
											<span
												className="form-control"
												style={{ background: "transparent", width: "100px" }}>
												{data?.sum}
											</span>
										</td>
									</tr>
								</MDBTableBody>
							</MDBTable>
						</TableDiv>
					</TablePack>

					<MDBBtn
						type="submit"
						style={{
							background: "yellowgreen",
							borderRadius: "20px",
							width: "200px",
							color: "black",
						}}
						disabled={data ? data.isApproved : false}>
						Submit
						<MDBIcon size="lg" className="ms-2" fas icon="check-circle" />
					</MDBBtn>
				</UserContent>
			</form>
		</>
	);
};
