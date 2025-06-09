"use client";

// main
import { useState } from "react";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/main.css";

// elems
import Navbar from "../../partials/navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

// 3rd party
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [loginForm] = useState({
		email: "",
		password: "",
	});

	const login = async () => {
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

		setLoading(true);

		await axios
			.post(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					"users/login",
				loginForm
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

	return (
		<>
			<Navbar activeNav={"login"}></Navbar>
			<ToastContainer />

			<Container className="pt-3">
				<Row>
					<Col md={3}></Col>
					<Col md={6}>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title className="text-primary">
									Login
								</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									Enter
									login
									credentials
									management
									appointments
								</Card.Subtitle>
								{loading ? (
									<div className="text-center">
										<Spinner
											animation="border"
											variant="primary"
										></Spinner>
									</div>
								) : (
									<Form>
										<Form.Group
											className="mb-3"
											controlId="formBasicEmail"
										>
											<Form.Label>
												Email
												address
											</Form.Label>
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

										<Form.Group
											className="mb-3"
											controlId="formBasicPassword"
										>
											<Form.Label>
												Password
											</Form.Label>
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
								)}
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}></Col>
				</Row>
			</Container>
		</>
	);
}
