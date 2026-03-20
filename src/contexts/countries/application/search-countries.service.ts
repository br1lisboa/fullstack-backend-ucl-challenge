import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { CountryRepository } from "../domain/country.repository.js";
import { CountryPrimitives } from "../domain/country.entity.js";

@injectable()
export class SearchCountriesService {
  constructor(
    @inject(TYPES.CountryRepository)
    private readonly countryRepository: CountryRepository
  ) {}

  async run(): Promise<CountryPrimitives[]> {
    const countries = await this.countryRepository.findAll();
    return countries.map((country) => country.toPrimitives());
  }
}
