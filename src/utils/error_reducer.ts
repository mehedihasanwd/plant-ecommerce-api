import joi from "joi";

export const errorReducer = (details: joi.ValidationErrorItem[]): object => {
  return details.reduce((acc: object, cur: any) => {
    acc[cur.path[0]] = cur.message;
    return acc;
  }, {});
};
