import { CountryEntity } from "./country.entity.js";

export interface CountryRepository {
  findAll(): Promise<CountryEntity[]>;
}
