/**
 * Final project leaderboard.
 *
 * To refresh scores: overwrite assets/cs6013ProjectGrading - Final.csv
 * Required headers: Alias, Compression Target, Track_1 Score (0–100).
 * Extra columns (Roll no., Track_2, Remarks, …) are ignored.
 * Rows with any target other than 10% / 20% are ignored.
 */
const CONFIG = {
  csvUrl: "../assets/cs6013ProjectGrading - Final.csv",
  targets: ["10%", "20%"],
  scoreHeader: "track_1 score",
  scoreMax: 100,
  tickStep: 20,
  // Baseline performance: mean ± std on the 0–100 score scale.
  baselines: {
    "10%": { mean: 43.5, std: 4.123105626 },
    "20%": { mean: 43.5, std: 4.123105626 },
  },
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
  if (!rows.length) return [];
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
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), CONFIG.scoreMax);
}

function normalizeTarget(value) {
  const match = String(value).match(/(\d+)\s*%/);
  return match ? `${match[1]}%` : String(value).trim();
}

function formatScore(score) {
  if (Number.isInteger(score)) return String(score);
  return score.toFixed(2).replace(/\.?0+$/, "");
}

function formatBaseline(b) {
  return `${formatScore(b.mean)} ± ${formatScore(b.std)}`;
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

async function loadRecords() {
  const response = await fetch(encodeURI(CONFIG.csvUrl), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not find ${CONFIG.csvUrl} (HTTP ${response.status}).`);
  }
  const text = await response.text();
  return rowsToObjects(parseCSV(text));
}

function medalClass(rank, score) {
  if (!(score > 0)) return "medal";
  if (rank === 1) return "medal gold";
  if (rank === 2) return "medal silver";
  if (rank === 3) return "medal bronze";
  return "medal";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Fills the lede from CONFIG so baselines only need editing in one place.
function renderBaselineNote() {
  const el = document.getElementById("baseline-text");
  if (!el) return;
  const parts = CONFIG.targets
    .map((t) => [t, CONFIG.baselines?.[t]])
    .filter(([, b]) => b);
  if (!parts.length) {
    el.textContent = "—";
    return;
  }
  const texts = parts.map(([, b]) => formatBaseline(b));
  el.textContent = texts.every((t) => t === texts[0])
    ? texts[0]
    : parts.map(([t, b]) => `${formatBaseline(b)} at ${t}`).join(", ");
}

function baselineRow(baseline) {
  return `
    <tr class="baseline-row">
      <td>—</td>
      <td>Baseline</td>
      <td>${formatBaseline(baseline)}</td>
    </tr>`;
}

function entryRow(entry) {
  return `
    <tr>
      <td><span class="${medalClass(entry.rank, entry.score)}">${entry.rank}</span></td>
      <td>${escapeHtml(entry.alias)}</td>
      <td>${formatScore(entry.score)}</td>
    </tr>`;
}

function renderTable(entries, baseline) {
  if (!entries.length && !baseline) {
    return `<p class="empty">No submissions for this compression target yet.</p>`;
  }

  // Insert the baseline row where it would rank by score.
  const rows = [];
  let baselineDone = !baseline;
  for (const entry of entries) {
    if (!baselineDone && entry.score < baseline.mean) {
      rows.push(baselineRow(baseline));
      baselineDone = true;
    }
    rows.push(entryRow(entry));
  }
  if (!baselineDone) rows.push(baselineRow(baseline));

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
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>`;
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
  const height = 340;
  // Extra top margin so leader labels at 100 stay inside the SVG.
  const margin = { top: 52, right: 18, bottom: 48, left: 52 };
  const plotLeft = margin.left;
  const plotTop = margin.top;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const yMax = CONFIG.scoreMax;
  const yAt = (score) => plotTop + plotHeight * (1 - score / yMax);

  const ticks = [];
  for (let v = 0; v <= yMax; v += CONFIG.tickStep) ticks.push(v);

  // With only two columns each is wide, so spread dots a bit more.
  const jitter = 30;
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

    // At most two label lines per column; collapse larger ties.
    const yLabel = yAt(leaders[0].score) - 14;
    const lines =
      leaders.length <= 2
        ? leaders.map((l) => ({ name: l.alias, score: l.score }))
        : [
            { name: leaders[0].alias, score: leaders[0].score },
            { name: `+${leaders.length - 1} more tied`, score: null },
          ];

    lines.forEach((line, i) => {
      labels.push({ x: x0, y: yLabel - i * 16, ...line });
    });
  });

  const grid = ticks
    .map((tick) => {
      const y = yAt(tick);
      return `<line class="grid" x1="${plotLeft}" y1="${y}" x2="${plotLeft + plotWidth}" y2="${y}" />
        <text class="tick-label" x="${plotLeft - 8}" y="${y + 4}" text-anchor="end">${tick}</text>`;
    })
    .join("");

  const clampScore = (s) => Math.min(Math.max(s, 0), yMax);
  const colWidth = plotWidth / CONFIG.targets.length;
  // Cap the band so it doesn't stretch across the whole wide column.
  const bandHalf = Math.min(colWidth * 0.35, 110);

  const baselineSvg = CONFIG.targets
    .map((target, i) => {
      const b = CONFIG.baselines?.[target];
      if (!b) return "";
      const x0 = columnX(i, plotLeft, plotWidth);
      const yTop = yAt(clampScore(b.mean + b.std));
      const yBot = yAt(clampScore(b.mean - b.std));
      const yMid = yAt(clampScore(b.mean));
      return `
        <rect class="baseline-band" x="${x0 - bandHalf}" y="${yTop}" width="${bandHalf * 2}" height="${Math.max(yBot - yTop, 1)}">
          <title>Baseline · ${formatBaseline(b)}</title>
        </rect>
        <line class="baseline-line" x1="${x0 - bandHalf}" y1="${yMid}" x2="${x0 + bandHalf}" y2="${yMid}" />
        <text class="baseline-label" x="${x0 + bandHalf}" y="${yBot + 13}" text-anchor="end">
          Baseline ${formatBaseline(b)}
        </text>`;
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
          ${escapeHtml(label.name)}${
            label.score == null
              ? ""
              : `<tspan class="top-score"> ${formatScore(label.score)}</tspan>`
          }
        </text>`,
    )
    .join("");

  const targetList = CONFIG.targets.map((t) => t.replace("%", " percent")).join(" and ");

  host.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Scatter of Final best scores (0 to 100) at ${targetList} compression">
      ${grid}
      <line class="axis" x1="${plotLeft}" y1="${plotTop}" x2="${plotLeft}" y2="${plotTop + plotHeight}" />
      <line class="axis" x1="${plotLeft}" y1="${plotTop + plotHeight}" x2="${plotLeft + plotWidth}" y2="${plotTop + plotHeight}" />
      <text class="axis-title" x="${plotLeft - 40}" y="${plotTop - 14}">Score</text>
      ${xLabels}
      ${baselineSvg}
      ${dotsSvg}
      ${labelsSvg}
    </svg>`;
}

function renderLeaderboard(records) {
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
      ${renderTable(entries, CONFIG.baselines?.[target])}
    `;
    boards.appendChild(section);
  }
}

async function main() {
  renderBaselineNote();
  const status = document.getElementById("status");
  try {
    const records = await loadRecords();
    if (!records.length) {
      status.textContent = `${CONFIG.csvUrl} is empty.`;
      return;
    }
    status.hidden = true;
    renderLeaderboard(records);
  } catch (error) {
    status.textContent = `Could not load the leaderboard. Serve this folder over HTTP (fetch is blocked from file://). ${error.message}`;
  }
}

main();