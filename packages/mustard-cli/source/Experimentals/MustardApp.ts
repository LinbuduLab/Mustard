export class MustardApp {
  registerOption() {}

  registerComnmand(factory: CommandFactory) {}
}

export class CommandRegistry {
  registerOption() {}
}

type CommandFactory = (command: any) => void;

const app = new MustardApp();

app.registerComnmand((command) => {
  command.setup();
  command.configure();
});
