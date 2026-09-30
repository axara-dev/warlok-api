import { IsIn } from "class-validator";

export class CreateCheckoutDto {
  @IsIn(["premium"])
  plan!: "premium";
}
