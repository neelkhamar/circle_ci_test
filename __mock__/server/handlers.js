import { rest } from "msw";
import { API_URL } from "../../apis/constants";
import { vehicleData } from "../data";

export const handlers = [
  rest.get(
    `${API_URL}api/v1/vehicles`,
    (req, res, ctx) => {
      return res(ctx.json(vehicleData));
    }
  ),

  rest.get(
    `${API_URL}api/v1/vehicles/types`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 23,
            code: "HTG",
            name: "HTG Transport",
          },
        ])
      );
    }
  ),

  rest.get(
    `${API_URL}api/v1/vehicles/1`,
    (req, res, ctx) => {
      return res(ctx.json(vehicleData[0]));
    }
  ),
];
