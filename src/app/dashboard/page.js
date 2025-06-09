"use client";

// main
import { useEffect, useState } from "react";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import "../../css/react-calendar.css";
import "../../css/main.css";

// elem
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Calendar from "react-calendar";

// components
import NavbarComponent from "../../partials/navbar-user";

// 3rd party
import axios from "axios";
import Cookies from "js-cookie";
import { Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
	const [appts, setAppts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [rescheduleForm] = useState({
		appt_id: "",
		dentist_id: "",
		specialization: "",
		appt_date: "",
		time_slot_id: "",
	});
	const [dentist, setDentist] = useState([]);
	const [timeslots, setTimeSlots] = useState([]);
	const [specialization, setSpecialization] = useState({});
	const [refresh, setRefresh] = useState(0);

	const getAppts = async () => {
		const token = Cookies.get("token") || "";

		if (!token) {
			console.log("Unauthenticated");
			window.location.href = "./";
			return false;
		}

		try {
			setLoading(true);

			await axios
				.get(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						"appt/user-appts",
					{
						headers: {
							Authorization: `${token}`,
						},
					}
				)
				.then((data) => {
					const apiData = data.data;
					const output = apiData.output;
					const result = apiData.result;

					if (Number(output)) {
						setAppts(result);
					} else {
						console.log("Unauthenticated");
					}
				})
				.catch(function (error) {})
				.finally(function () {
					setLoading(false);
				});
		} catch (error) {}
	};

	const cancel = async (appt_id) => {
		const token = Cookies.get("token") || "";

		if (!token) {
			console.log("Unauthenticated");
			window.location.href = "./";
			return false;
		}

		try {
			setLoading(true);

			await axios
				.post(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						"appt/cancel",
					{
						appt_id,
					},
					{
						headers: {
							Authorization: `${token}`,
						},
					}
				)
				.then((data) => {
					const apiData = data.data;
					const output = apiData.output;
					const msg = apiData.msg;

					console.log(output);

					if (output) {
						toast.success(msg, {
							position: "top-center",
							autoClose: 1500,
						});

						setTimeout(() => {
							getAppts();
						}, 1500);
					} else {
						console.log("Unauthenticated");
					}
				})
				.catch(function (error) {})
				.finally(function () {});
		} catch (error) {}
	};

	const getDentist = async () => {
		await axios
			.get(
				process.env.NEXT_PUBLIC_BACKEND_URL + "dentist",
				{}
			)
			.then((data) => {
				const apiData = data.data;
				const output = apiData.output;
				const result = apiData.result;

				if (Number(output)) {
					setDentist(result);

					let obj = {};

					result.map(function (data, i) {
						obj[data.id] =
							data.specialization;
					});

					setSpecialization(obj);
				} else {
					alert("Unauthenticated");
				}
			})
			.catch(function (error) {
				alert(error);
			})
			.finally(function () {
				// setLoading(false);
			});
	};

	const getTimeSlots = async () => {
		if (!rescheduleForm.dentist_id || !rescheduleForm.appt_date) {
			return false;
		}

		await axios
			.get(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					`time-slots?dentist_id=${rescheduleForm.dentist_id}&appt_date=${rescheduleForm.appt_date}`,
				{}
			)
			.then((data) => {
				const apiData = data.data;
				const output = apiData.output;
				const result = apiData.result;

				if (Number(output)) {
					setTimeSlots(result);
				} else {
					alert("Unauthenticated");
				}
			})
			.catch(function (error) {
				alert(error);
			})
			.finally(function () {
				// setLoading(false);
			});
	};

	const reschedule = async (appt_id) => {
		const token = Cookies.get("token") || "";

		if (!token) {
			console.log("Unauthenticated");
			window.location.href = "./";
			return false;
		}

		try {
			setLoading(true);

			await axios
				.post(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						"appt/reschedule",
					rescheduleForm,
					{
						headers: {
							Authorization: `${token}`,
						},
					}
				)
				.then((data) => {
					const apiData = data.data;
					const output = apiData.output;
					const msg = apiData.msg;

					if (output) {
						toast.success(msg, {
							position: "top-center",
							autoClose: 1500,
						});

						setTimeout(() => {
							rescheduleForm.appt_id =
								"";
							rescheduleForm.dentist_id =
								"";
							rescheduleForm.specialization =
								"";
							rescheduleForm.appt_date =
								"";
							rescheduleForm.time_slot_id =
								"";

							setShowModal(false);
							getAppts();
						}, 1500);
					} else {
						console.log("Unauthenticated");
					}
				})
				.catch(function (error) {})
				.finally(function () {});
		} catch (error) {}
	};

	useEffect(() => {
		getAppts();
		getDentist();
	}, []);

	return (
		<>
			<ToastContainer />
			<NavbarComponent
				activeNav={"dashboard"}
			></NavbarComponent>

			<Container className="pt-3">
				<Row>
					<Col md={1}></Col>
					<Col md={10}>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title className="text-primary">
									Dashboard
								</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									Here is
									a list
									of your
									booked
									appointments:
								</Card.Subtitle>

								{loading ? (
									<div className="text-center">
										<Spinner
											animation="border"
											variant="primary"
										></Spinner>
									</div>
								) : appts.length ===
								  0 ? (
									<div className="text-center mt-5 mb-5">
										No
										records
										found.
									</div>
								) : (
									<Table
										striped
										bordered
										hover
										className="mt-3 mb-5"
									>
										<thead>
											<tr>
												<th>
													Booking
													No.
												</th>
												<th>
													Dentist
												</th>
												<th>
													Specialization
												</th>
												<th className="text-center">
													Appt
													Date
												</th>
												<th className="text-center">
													Time
													Slot
												</th>
												<th>
													Status
												</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{appts?.map(
												(
													data,
													key
												) => (
													<tr
														key={`tr-${key}`}
													>
														<td>
															{
																data.id
															}
														</td>
														<td>
															{
																data.dentist
															}
														</td>
														<td>
															{
																data.specialization
															}
														</td>
														<td className="text-center">
															{
																data.appt_date
															}
														</td>
														<td className="text-center">
															{data.time_start +
																" - " +
																data.time_end}
														</td>
														<td>
															<div className="text-center">
																<Badge
																	bg={
																		data.status ==
																		"Booked"
																			? "success"
																			: "danger"
																	}
																>
																	{
																		data.status
																	}
																</Badge>
															</div>
														</td>
														<td className="text-center">
															{data.status ==
															"Cancelled" ? (
																""
															) : (
																<Dropdown>
																	<Dropdown.Toggle
																		variant="warning"
																		size="sm"
																	>
																		<Pencil />
																	</Dropdown.Toggle>

																	<Dropdown.Menu>
																		<Dropdown.Item
																			href="#"
																			onClick={() => {
																				rescheduleForm.appt_id =
																					data.id;

																				rescheduleForm.dentist_id =
																					"";
																				rescheduleForm.specialization =
																					"";
																				rescheduleForm.appt_date =
																					"";
																				rescheduleForm.time_slot_id =
																					"";

																				setShowModal(
																					true
																				);
																			}}
																		>
																			Reschedule
																		</Dropdown.Item>
																		<Dropdown.Item
																			href="#"
																			onClick={() => {
																				confirm(
																					"Are you sure you want to CANCEL this appointment?"
																				)
																					? cancel(
																							data.id
																					  )
																					: "";
																			}}
																		>
																			Cancel
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown>
															)}
														</td>
													</tr>
												)
											)}
										</tbody>
									</Table>
								)}
							</Card.Body>
						</Card>
					</Col>
					<Col md={1}></Col>
				</Row>
			</Container>

			<Modal
				show={showModal}
				onHide={() => {
					setShowModal(false);
				}}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Select New Time Slot to
						Reschedule
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{loading ? (
						<div className="text-center">
							<Spinner
								animation="border"
								variant="primary"
							></Spinner>
						</div>
					) : (
						<>
							<Form>
								<Form.Group className="mb-3">
									<Form.Label>
										Select
										Dentist
										*
									</Form.Label>
									<Form.Select
										onChange={(
											e
										) => {
											rescheduleForm.dentist_id =
												e.target.value;

											rescheduleForm.specialization =
												specialization[
													Number(
														e
															.target
															.value
													)
												];

											setRefresh(
												refresh +
													1
											);

											getTimeSlots();
										}}
									>
										<option value="">
											--
											Select
											--
										</option>
										{dentist?.map(
											(
												data,
												key
											) => (
												<option
													value={
														data.id
													}
													key={`doctor-${key}`}
												>
													{
														data.name
													}
												</option>
											)
										)}
									</Form.Select>
								</Form.Group>

								{!rescheduleForm.dentist_id ? (
									""
								) : (
									<>
										<Form.Group className="mb-3">
											<Form.Label>
												Specialization
											</Form.Label>
											<Form.Control
												type="text"
												defaultValue={
													rescheduleForm.specialization ??
													""
												}
												readOnly
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>
												Preferred
												Date
												*
											</Form.Label>
											<Calendar
												calendarType="hebrew"
												onChange={(
													d
												) => {
													rescheduleForm.appt_date =
														d.getFullYear() +
														"-" +
														(d.getMonth() +
															1) +
														"-" +
														d.getDate();

													getTimeSlots();

													console.log(
														rescheduleForm
													);
												}}
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>
												Available
												Time
												Slot
												*
											</Form.Label>
											{timeslots.length ===
											0 ? (
												<div>
													<u>
														Select
														date
														to
														show
														available
														time
														slots
													</u>
												</div>
											) : (
												timeslots?.map(
													(
														data,
														key
													) => (
														<Row>
															<Col>
																<Form.Check
																	inline
																	name="time-slot"
																	type="radio"
																	bg="dark"
																	key={`time-slot-${key}`}
																	disabled={
																		data.status ==
																		"Available"
																			? false
																			: true
																	}
																	onClick={(
																		e
																	) => {
																		rescheduleForm.time_slot_id =
																			e.target.value;
																	}}
																	value={
																		data.id
																	}
																/>

																{data.time_start +
																	" - " +
																	data.time_end}

																<Badge
																	bg={
																		data.status ==
																		"Available"
																			? "success"
																			: "danger"
																	}
																	className="ms-3"
																>
																	{
																		data.status
																	}
																</Badge>
															</Col>
														</Row>
													)
												)
											)}
										</Form.Group>
									</>
								)}

								<div className="text-center">
									<Button
										variant="primary"
										type="button"
										onClick={() => {
											confirm(
												"Are you sure you want to RESCHEDULE this record?"
											)
												? reschedule()
												: "";
										}}
									>
										Reschedule
									</Button>
								</div>
							</Form>
						</>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
}
