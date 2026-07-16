// @ts-check

import { renderContributionsCard } from "../src/cards/contributions.js";
import {
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import { MissingParamError, retrieveSecondaryMessage } from "../src/common/error.js";
import { parseBoolean } from "../src/common/ops.js";
import { renderError } from "../src/common/render.js";
import { fetchContributions } from "../src/fetchers/contributions.js";

// @ts-ignore
export default async (req, res) => {
  const {
    username,
    title,
    hide_title,
    hide_border,
    title_color,
    text_color,
    bg_color,
    border_color,
    theme,
    cache_seconds,
  } = req.query || {};

  res.setHeader("Content-Type", "image/svg+xml");

  if (!username) {
    return res.send(renderError(new MissingParamError(["username"])));
  }

  try {
    const contributionsData = await fetchContributions(username);
    const cacheSeconds = resolveCacheSeconds(cache_seconds, CACHE_TTL.STATS);
    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderContributionsCard(contributionsData, {
        title,
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      }),
    );
  } catch (err) {
    setErrorCacheHeaders(res);
    const secondaryMessage = retrieveSecondaryMessage(err);
    return res.send(renderError(err, secondaryMessage));
  }
};

// Inline minimal CACHE_TTL / resolveCacheSeconds to avoid import quirks
const CACHE_TTL = { STATS: 86400 };

function resolveCacheSeconds(cacheSec, defaultSec) {
  const sec = parseInt(cacheSec, 10);
  if (Number.isNaN(sec) || sec < 0) return defaultSec;
  if (sec > 86400) return 86400;
  return sec;
}
