import * as redis_service from "./redis_service";
import staff_service from "./staff_service";
import user_service from "./user_service";
import category_service from "./category_service";
import * as mailer from "./mailer";
import * as aws_s3 from "./amazon_s3";

export {
  redis_service,
  staff_service,
  user_service,
  mailer,
  aws_s3,
  category_service,
};
