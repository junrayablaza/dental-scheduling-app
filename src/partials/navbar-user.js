"use client";

// main
import { useEffect, useState } from "react";

// css
import "bootstrap/dist/css/bootstrap.min.css";

// elems
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// 3rd party
import axios from "axios";
import Cookies from "js-cookie";
import { House, User, Rocket } from "lucide-react";

export default function ({ activeNav }) {
	const [name, setName] = useState("");

	const checkSession = async () => {
		const token = Cookies.get("token") || "";

		if (!token) {
			console.log("Unauthenticated");
			window.location.href = "./";
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
					const name = apiData.user_name;

					if (Number(output)) {
						setName(name);
					} else {
						alert("Unauthenticated");
						window.location.href = "./";
					}
				})
				.catch(function (error) {})
				.finally(function () {});
		} catch (error) {}
	};

	const logout = async () => {
		const token = Cookies.get("token") || "";

		// return false;

		if (!token) {
			console.log("Unauthenticated");
			window.location.href = "./";
			return false;
		}

		try {
			await axios
				.get(
					process.env.NEXT_PUBLIC_BACKEND_URL +
						"users/logout",
					{
						headers: {
							Authorization: `${token}`,
						},
					}
				)
				.then((data) => {
					const apiData = data.data;
					const output = apiData.output;
					const name = apiData.user_name;

					if (Number(output)) {
						Cookies.remove("token", {
							path: "/",
						});
						window.location.href = "./";
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
					<Navbar.Brand href="./dashboard">
						<House /> Dental Clinic XYZ
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-end"
					>
						<Nav>
							<Nav.Link
								href="/dashboard"
								active={
									activeNav ==
									"dashboard"
										? true
										: false
								}
							>
								<Rocket />{" "}
								Dashboard
							</Nav.Link>

							<NavDropdown
								active={
									activeNav ==
									"user"
										? true
										: false
								}
								title={
									<>
										<User />{" "}
										<span>
											{
												name
											}
										</span>
									</>
								}
							>
								<NavDropdown.Item
									href="#"
									onClick={() => {
										logout();
									}}
								>
									Logout
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}
