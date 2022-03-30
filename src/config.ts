const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME") || Deno.env.get("HOME") + "/.config";
const CONFIG_DIR = XDG_CONFIG_HOME + "/era";
export const CONFIG_PATH = CONFIG_DIR + "/config.json";

export type Config = {
  interval: number;
  frequency: number;
  rain1: string;
  rain2: string;
  timecolor: string;
  raincolor: string;
};

export const config_example: Config = {
  interval: 100,
  frequency: 40,
  rain1: "│",
  rain2: " ",
  timecolor: "#eeeeee",
  raincolor: "#e0b0ff",
};

export const get_config = async (file_path: string): Promise<Config> => {
  const j = JSON.parse(await Deno.readTextFile(file_path));
  if (j.rain1 === "") {
    j.rain1 = " ";
  }
  if (j.rain2 === "") {
    j.rain2 = " ";
  }
  return j;
};

export const make_config = async () => {
  try {
    await Deno.stat(CONFIG_DIR);
  } catch (_error) {
    await Deno.mkdir(CONFIG_DIR).catch();
  }
  await Deno.writeTextFile(CONFIG_PATH, JSON.stringify(config_example));
};
