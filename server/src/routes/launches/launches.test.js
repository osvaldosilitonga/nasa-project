const request = require("supertest");

const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../utils/mongo");

describe("Testing all /launches", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should response with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("DELETE /launches/:id", () => {
    test("It should response with 200 success", async () => {
      const response = await request(app)
        .delete("/launches/100")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test("Fail Test - It should response with 404 not found", async () => {
      const response = await request(app)
        .delete("/launches/99")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("Test POST /launches", () => {
    const compleateLaunchData = {
      mission: "USS Enterprise",
      rocket: "Explore IS1",
      launchDate: "December 27, 2030",
      target: "Kepler-442 b",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "Explore IS1",
      target: "Kepler-442 b",
    };

    const invalidLaunchDate = {
      mission: "USS Enterprise",
      rocket: "Explore IS1",
      launchDate: "Pesember 27, 2030",
      target: "Kepler-442 b",
    };

    test("It should response with 201 created", async () => {
      // POST request test
      const response = await request(app)
        .post("/launches")
        .send(compleateLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      // Date matching test
      const requestDate = new Date(compleateLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      // Body matching test
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch Missing some launch information", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing Some Launch Information",
      });
    });

    test("It should catch Date is not correct", async () => {
      const response = await request(app)
        .post("/launches")
        .send(invalidLaunchDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Date is not correct",
      });
    });
  });
});
