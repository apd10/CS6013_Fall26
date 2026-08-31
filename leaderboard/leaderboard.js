/**
 * Weekly project leaderboard.
 *
 * To refresh scores: overwrite the week CSV(s) in assets/.
 * To add a week: drop in
 *   assets/cs6013ProjectGrading - WeekN(Anon).csv
 * with the same headers (Alias, Compression Target, Track_1 Score).
 * Extra columns (Roll no., Track_2, Remarks, …) are ignored.
 */
const CONFIG = {
  csvUrl: (week) => `assets/cs6013ProjectGrading - Week${week}(Anon).csv`,
  maxWeeks: 24,
  targets: ["10%", "20%", "40%"],
  scoreHeader: "track_1 score",
};

function normalizeHeader(value) {
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\r" && next === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i += 1;
    } else if (c === "\n" || c === "\r") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += c;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((value) => String(value).trim() !== ""));
}

function rowsToObjects(rows) {
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, i) => {
      record[header] = values[i] == null ? "" : String(values[i]).trim();
    });
    return record;
  });
}

function parseScore(value) {
  const n = Number.parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normalizeTarget(value) {
  const match = String(value).match(/(\d+)\s*%/);
  return match ? `${match[1]}%` : String(value).trim();
}

function formatScore(score) {
  if (Number.isInteger(score)) return String(score);
  const rounded = score.toFixed(6).replace(/\.?0+$/, "");
  return rounded;
}

function bestByAlias(records, target) {
  const best = new Map();

  for (const record of records) {
    if (normalizeTarget(record["compression target"]) !== target) continue;
    const alias = record.alias;
    if (!alias) continue;
    const score = parseScore(record[CONFIG.scoreHeader]);
    const prev = best.get(alias);
    if (!prev || score > prev.score) {
      best.set(alias, { alias, score });
    }
  }

  const ranked = [...best.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.alias.localeCompare(b.alias, undefined, { sensitivity: "base" });
  });

  let lastScore = null;
  let lastRank = 0;
  return ranked.map((entry, i) => {
    const rank = entry.score === lastScore ? lastRank : i + 1;
    lastScore = entry.score;
    lastRank = rank;
    return { ...entry, rank };
  });
}

async function loadWeeks() {
  const weeks = [];

  for (let n = 1; n <= CONFIG.maxWeeks; n++) {
    const url = CONFIG.csvUrl(n);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) break;
    const text = await response.text();
    const objects = rowsToObjects(parseCSV(text));
    if (!objects.length) break;
    weeks.push({ n, records: objects });
  }

  return weeks;
}

function cumulativeRecords(weeks, throughIndex) {
  return weeks.slice(0, throughIndex + 1).flatMap((week) => week.records);
}

function medalClass(rank, score) {
  if (!(score > 0)) return "medal";
  if (rank === 1) return "medal gold";
  if (rank === 2) return "medal silver";
  if (rank === 3) return "medal bronze";
  return "medal";
}

function renderTable(entries) {
  if (!entries.length) {
    return `<p class="empty">No submissions for this compression target yet.</p>`;
  }

  const body = entries
    .map(
      (entry) => `
        <tr>
          <td><span class="${medalClass(entry.rank, entry.score)}">${entry.rank}</span></td>
          <td>${escapeHtml(entry.alias)}</td>
          <td>${formatScore(entry.score)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Alias</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function niceYMax(maxScore) {
  if (!(maxScore > 0)) return 10;
  const padded = maxScore * 1.18;
  const step = padded <= 20 ? 5 : padded <= 50 ? 10 : 20;
  return Math.max(step, Math.ceil(padded / step) * step);
}

function columnX(index, plotLeft, plotWidth) {
  const n = CONFIG.targets.length;
  return plotLeft + ((index + 0.5) / n) * plotWidth;
}

function hashAlias(alias) {
  let h = 0;
  for (const ch of alias) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function renderScatter(rankedByTarget) {
  const host = document.getElementById("scatter");
  const width = 840;
  const height = 320;
  const margin = { top: 36, right: 18, bottom: 48, left: 52 };
  const plotLeft = margin.left;
  const plotTop = margin.top;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const allScores = rankedByTarget.flatMap((col) =>
    col.entries.map((entry) => entry.score),
  );
  const yMax = niceYMax(Math.max(0, ...allScores));
  const yAt = (score) => plotTop + plotHeight * (1 - score / yMax);

  const ticks = [];
  const step = yMax <= 20 ? 5 : yMax <= 50 ? 10 : 20;
  for (let v = 0; v <= yMax; v += step) ticks.push(v);

  const jitter = 22;
  const dots = [];
  const labels = [];

  rankedByTarget.forEach((col, colIndex) => {
    const x0 = columnX(colIndex, plotLeft, plotWidth);
    col.entries.forEach((entry) => {
      const offset = ((hashAlias(entry.alias) % 11) - 5) * (jitter / 5);
      dots.push({
        x: x0 + offset,
        y: yAt(entry.score),
        top: entry.rank === 1 && entry.score > 0,
        alias: entry.alias,
        score: entry.score,
      });
    });

    const leaders = col.entries.filter(
      (entry) => entry.rank === 1 && entry.score > 0,
    );
    if (!leaders.length) return;

    const xLabel = x0;
    const yLabel = yAt(leaders[0].score) - 14;
    leaders.forEach((leader, i) => {
      labels.push({
        x: xLabel,
        y: yLabel - i * 16,
        alias: leader.alias,
        score: leader.score,
      });
    });
  });

  const grid = ticks
    .map((tick) => {
      const y = yAt(tick);
      return `<line class="grid" x1="${plotLeft}" y1="${y}" x2="${plotLeft + plotWidth}" y2="${y}" />
        <text class="tick-label" x="${plotLeft - 8}" y="${y + 4}" text-anchor="end">${tick}</text>`;
    })
    .join("");

  const xLabels = CONFIG.targets
    .map((target, i) => {
      const x = columnX(i, plotLeft, plotWidth);
      return `<text class="tick-label" x="${x}" y="${plotTop + plotHeight + 22}" text-anchor="middle">${target}</text>`;
    })
    .join("");

  const dotsSvg = dots
    .map(
      (dot) =>
        `<circle class="dot${dot.top ? " top" : ""}" cx="${dot.x}" cy="${dot.y}" r="${dot.top ? 6 : 4.5}">
          <title>${escapeHtml(dot.alias)} · ${formatScore(dot.score)}</title>
        </circle>`,
    )
    .join("");

  const labelsSvg = labels
    .map(
      (label) => `
        <text class="top-label" x="${label.x}" y="${label.y}" text-anchor="middle">
          ${escapeHtml(label.alias)}
          <tspan class="top-score"> ${formatScore(label.score)}</tspan>
        </text>`,
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Scatter of best scores at 10, 20, and 40 percent compression">
      ${grid}
      <line class="axis" x1="${plotLeft}" y1="${plotTop}" x2="${plotLeft}" y2="${plotTop + plotHeight}" />
      <line class="axis" x1="${plotLeft}" y1="${plotTop + plotHeight}" x2="${plotLeft + plotWidth}" y2="${plotTop + plotHeight}" />
      <text class="axis-title" x="${plotLeft - 40}" y="${plotTop - 14}">Score</text>
      ${xLabels}
      ${dotsSvg}
      ${labelsSvg}
    </svg>`;
}

function renderWeek(weeks, weekIndex) {
  const records = cumulativeRecords(weeks, weekIndex);
  const rankedByTarget = CONFIG.targets.map((target) => ({
    target,
    entries: bestByAlias(records, target),
  }));

  renderScatter(rankedByTarget);

  const boards = document.getElementById("boards");
  boards.replaceChildren();

  for (const { target, entries } of rankedByTarget) {
    const section = document.createElement("section");
    section.className = "board";
    section.innerHTML = `
      <h3>${target} compression</h3>
      ${renderTable(entries)}
    `;
    boards.appendChild(section);
  }

  const note = document.getElementById("week-note");
  const week = weeks[weekIndex];
  note.textContent = `Best Track 1 score per alias through Week ${week.n} (${records.length} graded submissions).`;
}

function selectedWeekFromHash(weekCount) {
  const match = location.hash.match(/week-(\d+)/i);
  if (!match) return weekCount - 1;
  const n = Number(match[1]);
  const index = weeksIndex(n, weekCount);
  return index;
}

function weeksIndex(weekNumber, weekCount) {
  const i = weekNumber - 1;
  if (i < 0 || i >= weekCount) return weekCount - 1;
  return i;
}

function renderTabs(weeks, activeIndex) {
  const tabs = document.getElementById("week-tabs");
  tabs.replaceChildren();
  tabs.setAttribute("role", "tablist");

  weeks.forEach((week, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "week-tab" + (i === activeIndex ? " is-active" : "");
    button.id = `tab-week-${week.n}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
    button.textContent = `Week ${week.n}`;
    button.addEventListener("click", () => {
      location.hash = `week-${week.n}`;
    });
    tabs.appendChild(button);
  });
}

async function main() {
  const status = document.getElementById("status");
  try {
    const weeks = await loadWeeks();
    if (!weeks.length) {
      status.textContent =
        "No week CSVs found. Add assets/cs6013ProjectGrading - Week1(Anon).csv";
      return;
    }

    status.hidden = true;
    const show = () => {
      const active = selectedWeekFromHash(weeks.length);
      renderTabs(weeks, active);
      renderWeek(weeks, active);
    };

    window.addEventListener("hashchange", show);
    show();
  } catch (error) {
    status.textContent = `Could not load the leaderboard. Serve this folder over HTTP (fetch is blocked from file://). ${error.message}`;
  }
}

main();
