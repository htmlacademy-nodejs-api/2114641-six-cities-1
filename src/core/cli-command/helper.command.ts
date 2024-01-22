import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public execute(): void {
    console.log(
      chalk.green(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                                                        # выводит номер версии
            --help:                                                           # печатает этот текст
            --import <path> <login> <password> <host> <data base name> <salt> # импортирует данные из TSV файла и добавляет их в базу данных
            --generate <number of rows> <path> <port>                         # генерирует данные 
        `),
    );
  }
}
