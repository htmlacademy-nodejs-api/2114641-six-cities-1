import { Container } from 'inversify';
import { Application } from './app.js';
import { AppComponent } from '../types/app-component.enum.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import { PinoService } from '../core/logger/pino.service.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { ConfigService } from '../core/config/config.service.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { MongoClientService } from '../core/database-client/mongo-client.service.js';
import { ExceptionFilterInterface } from '../core/expception-filters/exception-filter.interface.js';
import { ExceptionFilter } from '../core/expception-filters/exception-filter.js';

export function createApplicationContainer() {
  const restApplicationContainer = new Container();
  restApplicationContainer.bind<Application>(AppComponent.RestApplication).to(Application).inSingletonScope();
  restApplicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  restApplicationContainer
    .bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface)
    .to(ConfigService)
    .inSingletonScope();
  restApplicationContainer
    .bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();
  restApplicationContainer
    .bind<ExceptionFilterInterface>(AppComponent.ExceptionFilterInterface)
    .to(ExceptionFilter)
    .inSingletonScope();

  return restApplicationContainer;
}
