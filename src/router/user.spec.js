import request from "supertest";
import should from "should";
import app from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("GET /users는,", () => {
    describe("성공시", () => {
        // const users = [{ name: "kim" }, { name: "jojo" }, { name: "holo" }];
        // before(async () => {
        //     await prisma.user.createMany({
        //         data: users,
        //     });
        // });
        it("유저 객체를 담은 배열로 응답함", (done) => {
            request(app)
                .get("/users")
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });
        it("최대 limit 갯수만큼 응답한다.", (done) => {
            request(app)
                .get("/users?limit=2")
                .end((err, res) => {
                    res.body.should.have.lengthOf(2);
                    done();
                });
        });
    });
    describe("실패시", () => {
        it("limit이 숫자형이 아니면 400 응답", (done) => {
            request(app).get("/users?limit=two").expect(400).end(done);
        });
    });
});

describe("GET /users:id는", () => {
    describe("성공시", () => {
        it("id가 1인 객체를 반환", (done) => {
            request(app)
                .get("/users/1")
                .end((err, res) => {
                    res.body.should.have.property("id", 1);
                    done();
                });
        });
    });
    describe("실패시", () => {
        it("id 가 숫자가 아닌 경우 400 응답", (done) => {
            request(app).get("/users/one").expect(400).end(done);
        });
        it("id로 유저를 찾을 수 없는 경우 404", (done) => {
            request(app).get("/users/999").expect(404).end(done);
        });
    });
});

describe("DELETE /users:id", () => {
    describe("성공시", () => {
        it("204 응답", (done) => {
            request(app)
                .delete("/users/1")
                .expect(204)
                .end((err, res) => {
                    done();
                });
        });
    });
    describe("실패시", () => {
        it("id가 숫자가 아닌 경우 400", (done) => {
            request(app).delete("/users/ho").expect(400).end(done);
        });
    });
});

describe("POST /users", () => {
    describe("성공시", () => {
        let name = "go2",
            body;
        before((done) => {
            request(app)
                .post("/users")
                .send({ name })
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        it("유저 객체 반환", () => {
            body.should.have.property("id");
        });
        it("입력한 name 반환", () => {
            body.should.have.property("name", name);
        });
    });
    describe("실패시", () => {
        it("name 파라미터 누락시 400반환", (done) => {
            request(app).post("/users").send({}).expect(400).end(done);
        });
        it("name중복일시 409 반환", (done) => {
            request(app)
                .post("/users")
                .send({ name: "inhyeok" })
                .expect(409)
                .end(done);
        });
    });
});

describe.only("PUT /users/:id", () => {
    describe("성공시", () => {
        const name = "den1";
        it("변경된 name 응답", (done) => {
            request(app)
                .put("/users/3")
                .send({ name })
                .end((err, res) => {
                    res.body.should.have.property("name", name);
                    done();
                });
        });
    });
    describe("실패시", () => {
        it("정수가 아닌 id 인경우 400", (done) => {
            request(app).put("/users/one").expect(400).end(done);
        });
        it("name이 없는 경우 400", (done) => {
            request(app).put("/users/1").expect(400).send({}).end(done);
        });
        it("없는 유저인 경우 404", (done) => {
            request(app)
                .put("/users/999")
                .expect(404)
                .send({ name: "hoylis" })
                .end(done);
        });

        it("이름이 중복일 경우 409", (done) => {
            request(app)
                .put("/users/3")
                .send({ name: "inhyeok" })
                .expect(409)
                .end(done);
        });
    });
});
