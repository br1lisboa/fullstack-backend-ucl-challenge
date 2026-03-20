import { DomainError } from "../../../../shared/domain/domain-error.js";

export class DrawAlreadyExistsError extends DomainError {
  readonly httpStatus = 409;

  constructor() {
    super("A draw already exists");
  }
}
