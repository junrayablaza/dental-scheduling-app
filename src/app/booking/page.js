"use client";

import { useState, useEffect } from "react";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import "../../css/react-calendar.css";
import "../../css/main.css";

// elems
import Container from "react-bootstrap/Container";
import Calendar from "react-calendar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

// 3rd party
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

// components
import NavbarComponent from "../../partials/navbar";

export default function Page() {
	const [dentist, setDentist] = useState([]);
	const [timeslots, setTimeSlots] = useState([]);
	const [specialization, setSpecialization] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [formData] = useState({
		dentist_id: "",
		specialization: "",
		appt_date: "",
		time_slot_id: "",
	});
	const [registrationForm] = useState({
		name: "",
		contact_no: "",
		address: "",
		email: "",
		password: "",
		confirm_password: "",
	});
	const [refresh, setRefresh] = useState(0);
	const [finalizeBooking, setFinalizeBooking] = useState("login");
	const [loading, setLoading] = useState(false);
	const [loginForm] = useState({
		email: "",
		password: "",
	});
	// const [cookies, setCookie] = useCookies(["token"]);

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
		if (!formData.dentist_id || !formData.appt_date) {
			return false;
		}

		await axios
			.get(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					`time-slots?dentist_id=${formData.dentist_id}&appt_date=${formData.appt_date}`,
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

	const book = () => {
		if (!formData.dentist_id) {
			toast.error("Please select Dentist", {
				position: "top-center",
			});
			return false;
		}

		if (!formData.appt_date) {
			toast.error("Please select Appointment Date", {
				position: "top-center",
			});
			return false;
		}

		if (!formData.time_slot_id) {
			toast.error("Please select Time Slot", {
				position: "top-center",
			});
			return false;
		}

		setFinalizeBooking("login");
		setShowModal(true);
	};

	const register = () => {
		if (!registrationForm.name) {
			toast.error("Please Enter Full Name", {
				position: "top-center",
			});
			return false;
		}

		if (!registrationForm.contact_no) {
			toast.error("Please Enter Contact No.", {
				position: "top-center",
			});
			return false;
		}

		if (!registrationForm.address) {
			toast.error("Please Enter Address", {
				position: "top-center",
			});
			return false;
		}

		if (!registrationForm.email) {
			toast.error("Please Enter Email", {
				position: "top-center",
			});
			return false;
		}

		if (!registrationForm.password) {
			toast.error("Please Enter Password", {
				position: "top-center",
			});
			return false;
		}

		if (
			registrationForm.password !=
			registrationForm.confirm_password
		) {
			toast.error("Password Mismatch", {
				position: "top-center",
			});
			return false;
		}

		registerUserBookAppt();
	};

	const registerUserBookAppt = async () => {
		setLoading(true);

		// run api - post appt and user details
		await axios
			.post(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					"register-user-book-appt",
				{
					appt: formData,
					user: registrationForm,
				}
			)
			.then((data) => {
				const apiData = data.data;
				const output = apiData.output;
				const msg = apiData.msg;
				const token = apiData.token;

				if (Number(output)) {
					Cookies.set("token", token, {
						expires: 1,
					});

					toast.success(msg, {
						position: "top-center",
						autoClose: 1500,
					});

					// redirect to dashboard
					setTimeout(() => {
						window.location.href =
							"./dashboard";
					}, 1500);
				} else {
					toast.error(msg, {
						position: "top-center",
					});
					setLoading(false);
					return false;
				}
			})
			.catch(function (error) {
				alert(error);
			})
			.finally(function () {});
	};

	const login = () => {
		if (!loginForm.email) {
			toast.error("Please Enter Email", {
				position: "top-center",
			});
			return false;
		}

		if (!loginForm.password) {
			toast.error("Please Enter Password", {
				position: "top-center",
			});
			return false;
		}

		loginUserBookAppt();
	};

	const loginUserBookAppt = async () => {
		setLoading(true);

		await axios
			.post(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					"login-user-book-appt",
				{
					appt: formData,
					user: loginForm,
				}
			)
			.then((data) => {
				const apiData = data.data;
				const output = apiData.output;
				const msg = apiData.msg;
				const token = apiData.token;

				if (Number(output)) {
					Cookies.set("token", token, {
						expires: 1,
					});

					toast.success(msg, {
						position: "top-center",
						autoClose: 1500,
					});

					// redirect to dashboard
					setTimeout(() => {
						window.location.href =
							"./dashboard";
					}, 1500);
				} else {
					toast.error(msg, {
						position: "top-center",
					});
					setLoading(false);
					return false;
				}
			})
			.catch(function (error) {
				alert(error);
			})
			.finally(function () {});
	};

	useEffect(() => {
		getDentist();
	}, []);

	return (
		<>
			<NavbarComponent activeNav={"booking"} />
			<ToastContainer />

			<Container className="pt-3">
				<Row>
					<Col md={3}></Col>
					<Col md={6}>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title className="text-primary">
									Book
									Appointment
								</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									Please
									complete
									the
									required
									(*)
									fields
									to
									schedule
									an
									appointment.
								</Card.Subtitle>

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
												formData.dentist_id =
													e.target.value;

												formData.specialization =
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

									{!formData.dentist_id ? (
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
														formData.specialization ??
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
														formData.appt_date =
															d.getFullYear() +
															"-" +
															(d.getMonth() +
																1) +
															"-" +
															d.getDate();

														getTimeSlots();

														console.log(
															formData
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
																			formData.time_slot_id =
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
												book();
											}}
										>
											Book
										</Button>
									</div>
								</Form>
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}></Col>
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
						Finalize your booking
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
					) : finalizeBooking == "login" ? (
						<>
							<div className="mb-3">
								Enter login
								credentials to
								finalize your
								booking
							</div>

							<Form>
								<Form.Group className="mb-3">
									<Form.Control
										type="email"
										placeholder="Enter email"
										onChange={(
											e
										) => {
											loginForm.email =
												e.target.value;
										}}
										defaultValue={
											loginForm.email
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Control
										type="password"
										placeholder="Password"
										onChange={(
											e
										) => {
											loginForm.password =
												e.target.value;
										}}
										defaultValue={
											loginForm.password
										}
									/>
								</Form.Group>

								<div className="text-center">
									<Button
										variant="primary"
										type="button"
										onClick={() => {
											login();
										}}
									>
										Login
									</Button>
								</div>
							</Form>
							<div className="text-center mt-4 mb-4">
								<div></div>
								<Button
									variant="link"
									onClick={() => {
										setFinalizeBooking(
											"register"
										);
									}}
								>
									Don't
									have an
									account?
									Click
									here to
									register
								</Button>
							</div>
						</>
					) : (
						<>
							<div className="mb-3">
								Enter account
								information
							</div>

							<Form>
								<Form.Group className="mb-3">
									<Form.Label>
										Full
										Name
										*
									</Form.Label>
									<Form.Control
										type="text"
										onChange={(
											e
										) => {
											registrationForm.name =
												e.target.value;
										}}
										defaultValue={
											registrationForm.name
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label>
										Contact
										No.
										*
									</Form.Label>
									<Form.Control
										type="text"
										onChange={(
											e
										) => {
											registrationForm.contact_no =
												e.target.value;
										}}
										defaultValue={
											registrationForm.contact_no
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label>
										Address
										*
									</Form.Label>
									<Form.Control
										as="textarea"
										style={{
											height: "100px",
										}}
										onChange={(
											e
										) => {
											registrationForm.address =
												e.target.value;
										}}
										defaultValue={
											registrationForm.address
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label>
										Email
										*
									</Form.Label>
									<Form.Control
										type="email"
										onChange={(
											e
										) => {
											registrationForm.email =
												e.target.value;
										}}
										defaultValue={
											registrationForm.email
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label>
										Password
										*
									</Form.Label>
									<Form.Control
										type="password"
										onChange={(
											e
										) => {
											registrationForm.password =
												e.target.value;
										}}
										defaultValue={
											registrationForm.password
										}
									/>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label>
										Confirm
										Password
										*
									</Form.Label>
									<Form.Control
										type="password"
										onChange={(
											e
										) => {
											registrationForm.confirm_password =
												e.target.value;
										}}
										defaultValue={
											registrationForm.confirm_password
										}
									/>
								</Form.Group>

								<div className="text-center">
									<Button
										variant="primary"
										type="button"
										onClick={() => {
											register();
										}}
									>
										Register
									</Button>
								</div>
							</Form>
							<div className="text-center mt-4 mb-4">
								<div></div>
								<Button
									variant="link"
									onClick={() => {
										setFinalizeBooking(
											"login"
										);
									}}
								>
									Enter
									login
									credentials
									instead
								</Button>
							</div>
						</>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
}
