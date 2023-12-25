import redis, { createClient } from "redis";
import dotenvconfig from "../config/dotenvconfig";

const redis_client: redis.RedisClientType = createClient({
  password: `${dotenvconfig.REDIS_PASSWORD}`,
  socket: {
    host: `${dotenvconfig.REDIS_HOST}`,
    port: dotenvconfig.REDIS_PORT,
  },
});

redis_client.on("error", (error: redis.ClientClosedError) => {
  console.log(`Redis ClientClosedError`, error.message);
});

if (!redis_client.isOpen) {
  redis_client.connect();
}

// caching
interface IKey {
  key: string;
}

interface ISaveToCacheParam extends IKey {
  document: object | object[] | string | number;
  EX: number;
}

interface IRemoveFromCacheParam {
  key: string | string[];
}

export const saveToCache = async ({
  key,
  document,
  EX,
}: ISaveToCacheParam): Promise<string | null> => {
  return await redis_client.set(key, JSON.stringify(document), { EX });
};

export const removeFromCache = async ({
  key,
}: IRemoveFromCacheParam): Promise<number> => {
  return await redis_client.del(key);
};

export const getDocumentFromCache = async ({
  key,
}: IKey): Promise<string | null> => {
  const cached_key: string | null = await redis_client.get(key);
  return cached_key;
};

export const getCacheKeys = async (): Promise<string[] | null> => {
  const keys: string[] = await redis_client.KEYS("*");
  return keys.length > 0 ? keys : null;
};

interface IClearKeysParam {
  key: "staffs" | "users" | "categories" | "products" | "orders" | "reviews";
}

export const clearKeys = async ({
  key,
}: IClearKeysParam): Promise<number | ""> => {
  const keys: Array<string> | null = await getCacheKeys();
  const matched_keys: Array<string> | null = keys
    ? keys.filter((item: string) => item.match(key))
    : null;

  return matched_keys ? await removeFromCache({ key: matched_keys }) : "";
};
