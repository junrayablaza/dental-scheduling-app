"use client";

// main
import { useEffect } from "react";

// css
import "bootstrap/dist/css/bootstrap.min.css";

// elems
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// 3rd party
import axios from "axios";
import Cookies from "js-cookie";
import { House, BookText, LogIn } from "lucide-react";

export default function ({ activeNav }) {
	const checkSession = async () => {
		const token = Cookies.get("token") || "";

		// return false;

		if (!token) {
			console.log("Unauthenticated");
			return false;
		}

		try {
			await axios
				.get(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						"users/details",
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

					if (Number(output)) {
						window.location.href =
							"./dashboard";
					} else {
						console.log("Unauthenticated");
					}
				})
				.catch(function (error) {})
				.finally(function () {});
		} catch (error) {}
	};

	useEffect(() => {
		checkSession();
	}, []);

	return (
		<>
			<Navbar
				expand="lg"
				bg="primary"
				data-bs-theme="dark"
				style={{ background: "#0A7BC2" }}
			>
				<Container>
					<Navbar.Brand href="/">
						<House /> Dental Clinic XYZ
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-end"
					>
						<Nav>
							<Nav.Link
								href="/booking"
								active={
									activeNav ==
									"booking"
										? true
										: false
								}
							>
								<BookText />{" "}
								Book Appointment
							</Nav.Link>
							<Nav.Link
								href="/login"
								active={
									activeNav ==
									"login"
										? true
										: false
								}
							>
								<LogIn /> Login
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}
