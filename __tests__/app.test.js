const request = require("supertest");
const app = require("../app/app");
const testData = require("../db/data/test-data/");
const mongoose = require("mongoose");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  mongoose.connection.close();
});

describe("GET /api/notARoute", () => {
  test("404: Not found for route that does not exist", () => {
    return request(app)
      .get("/api/notaroute")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route Does Not Exist");
      });
  });
});

describe("GET /api/mushrooms", () => {
  test("responds with status code 200 and an object in expected format", () => {
    return request(app)
      .get("/api/mushrooms")
      .expect(200)
      .then(({ body: { mushrooms } }) => {
        expect(mushrooms.length).toBeGreaterThan(0);
        mushrooms.forEach((mushroom) => {
          expect(mushroom.commonName).toEqual(expect.any(String));
          expect(mushroom.latinName).toEqual(expect.any(String));
          expect(mushroom.order).toEqual(expect.any(String));
          expect(mushroom.genus).toEqual(expect.any(String));
          expect(mushroom.attributes).toEqual(expect.any(Object));
          expect(mushroom.habitat).toEqual(expect.any(String));
          expect(mushroom.months).toEqual(expect.any(Array));
          expect(mushroom.colors).toEqual(expect.any(Array));
          expect(mushroom.toxic).toEqual(expect.any(Boolean));
          expect(mushroom.averageHeight).toEqual(expect.any(Number));
        });
      });
  });
});

describe("GET /api/reports", () => {
  test("responds with status code 200 and an object in expected format", () => {
    return request(app)
      .get("/api/reports")
      .expect(200)
      .then(({ body: { reports } }) => {
        expect(reports.length).toBeGreaterThan(0);
        reports.forEach((report) => {
          expect(report.location).toEqual(expect.any(Object));
          expect(report.img_url).toEqual(expect.any(String));
          expect(report.username).toEqual(expect.any(String));
          expect(report.time_stamp).toEqual(expect.any(String));
          expect(report.species).toEqual(expect.any(Object));
          expect(report.credibility).toEqual(expect.any(Number));
          expect(report.alternate_species).toEqual(expect.any(Array));
          expect(report.prevalence).toEqual(expect.any(Number));
        });
      });
  });
});

describe("GET /api/mushrooms/:name", () => {
  test("responds with status code 200 and an object in expected format", () => {
    return request(app)
      .get("/api/mushrooms/Common Mushroom")
      .expect(200)
      .then(({ body: { mushrooms } }) => {
        expect(mushrooms.length).toBeGreaterThan(0);
        mushrooms.forEach((mushroom) => {
          expect(mushroom.commonName).toBe("Common Mushroom");
          expect(mushroom.latinName).toEqual(expect.any(String));
          expect(mushroom.order).toEqual(expect.any(String));
          expect(mushroom.genus).toEqual(expect.any(String));
          expect(mushroom.attributes).toEqual(expect.any(Object));
          expect(mushroom.habitat).toEqual(expect.any(String));
          expect(mushroom.months).toEqual(expect.any(Array));
          expect(mushroom.colors).toEqual(expect.any(Array));
          expect(mushroom.toxic).toEqual(expect.any(Boolean));
          expect(mushroom.averageHeight).toEqual(expect.any(Number));
        });
      });
  });
  test("responds with status code 400 when provided a name that doesn't exist", () => {
    return request(app)
      .get("/api/mushrooms/NotAMushroom")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/report", () => {
  test("responds with status code 201 and an object in expected format", () => {
    return request(app)
      .post("/api/reports")
      .send({
        report: {
          location: { lat: 0.0, long: 0.0 },
          img_url: "https://example.com/mushroom1.jpg",
          username: "user1",
          time_stamp: "2023-01-01T00:00:00Z",
          notes: "This is a test",
          species: { species: "Common Mushroom", votes: 1 },
          prevalence: 1.0,
        },
      })
      .expect(201)
      .then(({ _body: { report } }) => {
        console.log(report);
        expect(report.location).toEqual({ lat: 0.0, long: 0.0 });
        expect(report.img_url).toBe("https://example.com/mushroom1.jpg");
        expect(report.username).toBe("user1");
        expect(report.time_stamp).toBe("2023-01-01T00:00:00Z");
        expect(report.species).toEqual({
          species: "Common Mushroom",
          votes: 1,
        });
        expect(report.credibility).toEqual(expect.any(Number));
        expect(report.alternate_species).toEqual(expect.any(Array));
        expect(report.prevalence).toBe(1.0);
      });
  });
  test("responds with status code 400 when provided a report with missing keys", () => {
    return request(app)
      .post("/api/reports")
      .send({
        report: {},
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
