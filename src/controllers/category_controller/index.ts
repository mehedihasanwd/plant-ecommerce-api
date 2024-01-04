import * as get from "./get";
import * as post from "./post";
import * as patch from "./patch";
import * as put from "./put";
import * as remove from "./delete";

export default {
  ...get,
  ...post,
  ...patch,
  ...put,
  ...remove,
};
