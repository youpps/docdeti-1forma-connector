import { OneFormaRepository, OneFormaRepositoryConstructor } from "./oneFormaRepository";

class Repositories {
  readonly oneFormaRepository: OneFormaRepository;

  constructor(OneFormaRepositoryConstructor: OneFormaRepositoryConstructor) {
    this.oneFormaRepository = new OneFormaRepository(OneFormaRepositoryConstructor);
  }
}

export { Repositories };
