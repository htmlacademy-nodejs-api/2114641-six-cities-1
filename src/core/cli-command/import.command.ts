import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createOffer, getErrorMessage } from '../helpers/index.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import { OfferService } from '../../modules/offer/offer.service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { Offer } from '../../types/offer.type.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import { MongoClientService } from '../database-client/mongo-client.service.js';
import { UserService } from '../../modules/user/user.service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserModel } from '../../modules/user/user.entity.js';
import { getMongoURI } from '../helpers/index.js';
import { ConsoleLoggerService } from '../logger/console.service.js';

const DEFAULT_DB_PORT = '27017';
const DEFAULT_USER_PASSWORD = '123456';
export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private logger!: LoggerInterface;
  private databaseService!: DatabaseClientInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.user,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt,
    );

    await this.offerService.create({ ...offer, userId: user.id });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);

    await this.saveOffer(offer);

    resolve();
  }

  private async onComplete(count: number) {
    console.log(`${count} rows imported.`);

    await this.databaseService.disconnect();
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    await fileReader.on('line', this.onLine);
    await fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
