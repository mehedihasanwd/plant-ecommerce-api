import * as create from "./create";
import * as find from "./find";
import * as update from "./update";
import * as remove from "./remove";

export default {
  ...create,
  ...find,
  ...update,
  ...remove,
};
