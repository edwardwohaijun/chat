import { LOCALES } from "./locales";
import Chinese from "./cn.json";
import English from "./en.js";
import Portuguese from "./pt.json";
import Vietnamese from "./vi.json";
import Russian from "./ru.json";

export const messages = {
  [LOCALES.ENGLISH]: English,
  [LOCALES.CHINESE]: Chinese,
  [LOCALES.RUSSIAN]: Russian,
  [LOCALES.VIETNAMESE]: Vietnamese,
  [LOCALES.PORTUGUESE]: Portuguese,
};
