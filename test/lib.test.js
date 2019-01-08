const { got } = require("./mocks");
const { date_ago } = require("../lib/util");
const { issues } = require("./mocks/issues.json");
const {
  request,
  lead,
  cycle,
  metrics,
  date_to_status,
  query,
  report
} = require("../lib");

let options = {
  done: "Done",
  todo: "ToDo",
  start: "2017-08-01",
  finish: "2017-08-26",
  jira: "jira",
  user: "user",
  pass: "pass",
  endpoint: "%jira/%jql",
  query: "test",
  interval: 2,
  period: 4,
  report: false
};

const makeOptions = opts => Object.assign({}, options, opts);

describe("lib", () => {
  describe("#request", () => {
    test("should return a function", () => {
      expect(typeof request(options)).toBe("function");
    });

    test("function returned should return a promise", async () => {
      const api = request(options, got);
      const res = await api();
      expect(api() instanceof Promise).toBe(true);
      expect(res.length).toBe(4);
      expect(res).toHaveLength(4);
    });
  });

  describe("#lead", () => {
    test("should return return the lead time for given issue", () => {
      expect(lead(issues[0], "ToDo")).toBe(1);
      expect(lead(issues[1], "ToDo")).toBe(1);
      expect(lead(issues[2], "ToDo")).toBe(1);
      expect(lead(issues[3], "ToDo")).toBe(1);
    });
  });

  describe("#cycle", () => {
    test("should return return the lead time for given issue", () => {
      expect(cycle(issues[0], "In Progress", "ToDo")).toBe(1);
      expect(cycle(issues[1], "In Progress", "ToDo")).toBe(2);
      expect(cycle(issues[2], "In Progress", "ToDo")).toBe(1);
      expect(cycle(issues[3], "In Progress", "ToDo")).toBe(8);
    });

    test("should use issue creation date when status transition date not available", () => {
      expect(cycle(issues[3], "NonExistent", "ToDo")).toBe(1);
    });
  });

  describe("#date_to_status", () => {
    test("should return the date transition to a given status", () => {
      expect(
        date_to_status("NonExistentSTatus", issues[0].changelog)
      ).toBeUndefined();
      expect(date_to_status("ToDo", issues[0].changelog)).toBe(
        "2017-08-07T11:56:53.090+0000"
      );
      expect(date_to_status("In Progress", issues[0].changelog)).toBe(
        "2017-08-07T11:56:57.293+0000"
      );
    });
  });

  describe("#query", () => {
    describe("should collect metrics for specific interval", () => {
      it("should return correct output for given options", async () => {
        const a = await query(options, got);

        const b = await query(
          makeOptions({
            start: "2017-08-01",
            finish: "2017-08-03"
          }),
          got
        );

        const c = await query(
          makeOptions({
            start: "2017-08-01",
            finish: "2017-08-05"
          }),
          got
        );

        expect(a).toMatchObject({ throughput: 0.16 });
        expect(b).toMatchObject({ throughput: 2 });
        expect(c).toMatchObject({ throughput: 1 });
      });
    });
  });

  describe("#report", () => {
    describe("should collect metrics for specific period & interval", () => {
      it("should not be used when report set to false", async () => {
        const a = await report(options, got);
        const b = await report(makeOptions({ period: 9, interval: 3 }), got);
        expect(a).toHaveLength(2);
        expect(b).toHaveLength(3);
      });
    });
  });
});
