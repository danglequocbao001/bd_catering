import * as _ from "lodash";

export const requestQuery = (queries: object): string => {
  if (!queries) {
    return "";
  }
  let result: any = JSON.parse(JSON.stringify(queries));
  result = _.keys(result)
    .map((key: any) => {
      return result[key] !== null || result[key] !== undefined
        ? `${key}=${
            typeof result[key] == "object"
              ? JSON.stringify(result[key])
              : result[key]
          }`
        : "";
    })
    .filter((x: any) => x);
  return _.values(result).join("&");
};
