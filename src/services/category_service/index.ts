import * as find from "./find";
import * as create from "./create";
import * as update from "./update";
import * as remove from "./remove";

export default {
  ...find,
  ...create,
  ...update,
  ...remove,
};
