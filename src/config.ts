const XDG = Deno.env.get("HOME");
const CONFIG_DIR = XDG + "/.config/era";
export const CONFIG_PATH = CONFIG_DIR + "/config.json";

export type Config = {
  interval: number;
  frequency: number;
  rain1: string;
  rain2: string;
};

export const config_example: Config = {
  interval: 100,
  frequency: 40,
  rain1: "│",
  rain2: " ",
};

export const get_config = async (file_path: string): Promise<Config> => {
  return JSON.parse(await Deno.readTextFile(file_path));
};

export const make_config = async () => {
  try {
    await Deno.stat(CONFIG_DIR);
  } catch (_error) {
    await Deno.mkdir(CONFIG_DIR).catch();
  }
  await Deno.writeTextFile(CONFIG_PATH, JSON.stringify(config_example));
};
