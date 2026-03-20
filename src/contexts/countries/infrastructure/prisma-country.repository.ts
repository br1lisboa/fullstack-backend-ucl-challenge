import { injectable } from "inversify";
import { PrismaRepository } from "../../../shared/infrastructure/prisma.repository.js";
import { CountryEntity } from "../domain/country.entity.js";
import { CountryRepository } from "../domain/country.repository.js";

@injectable()
export class PrismaCountryRepository
  extends PrismaRepository<"Country">
  implements CountryRepository
{
  protected modelName = "Country" as const;

  async findAll(): Promise<CountryEntity[]> {
    const countries = await this.prisma.country.findMany({
      orderBy: { name: "asc" },
    });

    return countries.map((country) =>
      CountryEntity.fromPrimitives({
        id: country.id,
        name: country.name,
      })
    );
  }
}
