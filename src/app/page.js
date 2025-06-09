"use client";

// icons
import { MapPin, Hospital, Phone, Mail } from "lucide-react";

// elements
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/main.css";

// components
import NavbarComponent from "../partials/navbar";

export default function Home() {
	return (
		<>
			<NavbarComponent></NavbarComponent>

			<Container className="pt-3">
				<Row>
					<Col md={3}></Col>
					<Col md={6}>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title className="text-primary">
									Welcome
									to{" "}
									<u>
										Dental
										Clinic
										XYZ
									</u>{" "}
									<Hospital />
								</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									We’re
									committed
									to
									providing
									compassionate,
									personalized,
									and
									high-quality
									dental
									care for
									the
									whole
									family.
									Whether
									you're
									here for
									a
									routine
									check-up,
									cosmetic
									dentistry,
									or more
									advanced
									treatments,
									our
									experienced
									team is
									here to
									make
									your
									visit
									comfortable
									and
									stress-free.
								</Card.Subtitle>
							</Card.Body>
						</Card>

						<Card className="mb-3">
							<Card.Body className="pb-3">
								<Card.Title className="text-primary">
									Services
								</Card.Title>
								<Carousel>
									<Carousel.Item>
										<Image
											src="/img/homepage.webp"
											style={{}}
											thumbnail
										></Image>
										<Carousel.Caption className="text-primary">
											<Badge
												bg="light"
												text="info"
												style={{
													whiteSpace: "initial",
													background: "#0A7BC2",
													opacity: 0.9,
												}}
											>
												<h3>
													Preventive
													Care
												</h3>{" "}
												Routine
												Dental
												Checkups,
												Cleanings
												(Prophylaxis),
												Fluoride
												Treatments,
												etc.
											</Badge>
										</Carousel.Caption>
									</Carousel.Item>
									<Carousel.Item>
										<Image
											src="/img/pic-2.jpg"
											className="w-100"
											thumbnail
										></Image>
										<Carousel.Caption>
											<Badge
												bg="light"
												text="info"
												style={{
													whiteSpace: "initial",
													background: "#0A7BC2",
													opacity: 0.9,
												}}
											>
												<h3>
													Restorative
													Services
												</h3>{" "}
												Fillings,
												Crowns,
												Bridges,
												Dentures,
												Root
												Canals,
												Inlays
												and
												Onlays,
												etc.
											</Badge>
										</Carousel.Caption>
									</Carousel.Item>
									<Carousel.Item>
										<Image
											src="/img/pic-3.webp"
											className="w-100"
											thumbnail
										></Image>
										<Carousel.Caption>
											<Badge
												bg="light"
												text="info"
												style={{
													whiteSpace: "initial",
													background: "#0A7BC2",
													opacity: 0.9,
												}}
											>
												<h3>
													Cosmetic
													Dentistry
												</h3>{" "}
												Teeth
												Whitening,
												Veneers,
												Bonding,
												Smile
												Makeovers,
												etc.
											</Badge>
										</Carousel.Caption>
									</Carousel.Item>
								</Carousel>

								<div className="text-center mt-3">
									<Button
										variant="primary"
										onClick={() => {
											window.location.href =
												"/booking";
										}}
									>
										Click
										here
										to
										schedule
										an
										appointment
									</Button>
								</div>
							</Card.Body>
						</Card>

						<Card className="mb-3">
							<Card.Body>
								<Card.Title className="text-primary">
									Clinic
									Information:
								</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									<div className="mt-3">
										<Hospital />{" "}
										Dental
										Clinic
										XYZ
									</div>
									<div className="mt-3">
										<MapPin />{" "}
										One
										Ayala
										3F
										Ayala
										Ave.
										Brgy.
										Bel-Air,
										Makati
										City,
										Manila,
										Philippines
									</div>
									<div className="mt-3">
										<Phone />{" "}
										+63
										987
										654
										321,
										+639
										123
										45678
									</div>
									<div className="mt-3">
										<Mail />{" "}
										dentalclinicxyz@gmail.com
									</div>
								</Card.Subtitle>
							</Card.Body>
						</Card>
					</Col>
					<Col md={3}></Col>
				</Row>
			</Container>
		</>
	);
}
