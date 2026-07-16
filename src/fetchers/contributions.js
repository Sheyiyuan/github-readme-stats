// @ts-check
import { request } from "../common/http.js";
import { CustomError } from "../common/error.js";

/**
 * Fetch contribution calendar data from GitHub GraphQL API.
 *
 * @param {string} username GitHub username.
 * @returns {Promise<{totalContributions: number, weeks: Array}>}
 */
const fetchContributions = async (username) => {
  if (!username) {
    throw new CustomError("username is required", "MISSING_PARAM");
  }

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);
  // Pad "from" to the nearest past Sunday so weeks align
  const padFrom = new Date(from);
  padFrom.setDate(padFrom.getDate() - padFrom.getDay());
  const startDate = padFrom.toISOString().split("T")[0];
  const endDate = to.toISOString().split("T")[0];

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  const variables = { username, from: startDate + "T00:00:00Z", to: endDate + "T23:59:59Z" };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${process.env.PAT_1 || ""}`,
  };

  try {
    const res = await request(JSON.stringify({ query, variables }), headers);
    const data = res.data.data;
    if (!data || !data.user) {
      throw new CustomError("Could not fetch contributions", "USER_NOT_FOUND");
    }
    return data.user.contributionsCollection.contributionCalendar;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      "Contributions fetch failed: " + (err.message || "Unknown error"),
      "GRAPHQL_ERROR",
    );
  }
};

export { fetchContributions };
