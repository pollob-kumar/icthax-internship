const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const hex = (b) =>
  [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha = async (d) =>
  hex(
    await crypto.subtle.digest(
      "SHA-256",
      typeof d === "string" ? new TextEncoder().encode(d) : d,
    ),
  );
const KIND = {
  degree: "Degree certificate",
  prov: "Provisional certificate",
  tx: "Transcript",
};
const E = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m],
  );
const today = () => new Date().toISOString().slice(0, 10),
  base = () => location.href.split("#")[0];
const V = (f, k) => f.elements[k].value.trim();
let S = JSON.parse(localStorage.getItem("pubcc2") || "null") || {
    accts: {},
    students: [],
    certs: [],
    chain: [],
    shares: [],
    revq: [],
  },
  me = null,
  stu = null,
  stream = null;
const save = () => localStorage.setItem("pubcc2", JSON.stringify(S));
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(t.h);
  t.h = setTimeout(() => t.classList.remove("on"), 3200);
};
const run = async (f) => {
  try {
    await f();
  } catch (x) {
    console.error(x);
    toast(x.message);
  }
};
const need = (r) => {
  if (!me || me.role !== r)
    throw Error(`Only a signed-in ${r} account can do this.`);
};
const dl = (n, d, t) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([d], { type: t }));
  a.download = n;
  a.click();
};
const ISS = (id) =>
    S.chain.filter((b) => b.type === "ISSUE" && b.certId === id),
  REV = (id) => S.chain.find((b) => b.type === "REVOKE" && b.certId === id);
const row = (id, v) => S.certs.find((c) => c.id === id && c.v === v),
  ids = () => [...new Set(S.certs.map((c) => c.id))];
const last = (id) => S.certs.filter((c) => c.id === id).at(-1);

/* ---------- Ledger: local stand-in for the smart contract (see CertChain.sol) ---------- */
async function block(type, certId, hash, x = {}) {
  const prev = S.chain.length ? S.chain.at(-1).tx : "0".repeat(64),
    ts = new Date().toISOString(),
    tx = await sha(prev + type + certId + hash + ts);
  S.chain.push({
    n: S.chain.length,
    type,
    certId,
    hash,
    prev,
    tx,
    ts,
    by: me ? me.email : "public",
    ...x,
  });
  save();
}

/* ---------- Certificate PDF. The SHA-256 of these exact bytes goes on the chain ---------- */
function pdf(c) {
  if (!window.QRCode)
    throw Error(
      "QR library did not load. Connect to the internet once and reload.",
    );
  const W = 595,
    H = 842,
    k = [],
    q = (s) =>
      String(s)
        .replace(/[^\x20-\x7e]/g, "?")
        .replace(/[\\()]/g, "\\$&"),
    T = (x, y, z, f, s) =>
      k.push(`BT /F${f} ${z} Tf ${x} ${y} Td (${q(s)}) Tj ET`),
    R = (x, y, w, h, m = "S") => k.push(`${x} ${y} ${w} ${h} re ${m}`);
  k.push("0.72 0.57 0.18 RG 1.5 w");
  R(28, 28, W - 56, H - 56);
  k.push("0.5 w");
  R(36, 36, W - 72, H - 72);
  k.push("0.2 0.25 0.9 rg");
  T(60, 780, 14, 2, "PUB University  |  Office of the Registrar");
  k.push("0.05 0.1 0.17 rg");
  T(60, 720, 30, 2, KIND[c.kind]);
  T(60, 670, 13, 3, "This is to certify that");
  T(60, 630, 26, 2, c.name);
  T(60, 596, 13, 1, "has completed " + c.program);
  T(
    60,
    576,
    13,
    1,
    `with a CGPA of ${c.cgpa}` + (c.session ? ` (${c.session})` : ""),
  );
  let y = 530;
  (c.courses || "")
    .split("\n")
    .filter(Boolean)
    .slice(0, 18)
    .forEach((l) => {
      T(60, y, 12, 1, l);
      y -= 18;
    });
  T(60, 150, 11, 1, `Certificate ID: ${c.id}    Version: ${c.v}`);
  T(60, 134, 11, 1, `Issued: ${c.date} by ${c.issuer}`);
  const d = document.createElement("div"),
    o = new QRCode(d, {
      text: `${c.base}#verify=${c.id}`,
      width: 128,
      height: 128,
      correctLevel: QRCode.CorrectLevel.M,
    })._oQRCode,
    n = o.getModuleCount(),
    m = 110 / n;
  for (let r = 0; r < n; r++)
    for (let j = 0; j < n; j++)
      if (o.isDark(r, j))
        R(
          (430 + j * m).toFixed(2),
          (190 - (r + 1) * m).toFixed(2),
          m.toFixed(2),
          m.toFixed(2),
          "f",
        );
  T(430, 64, 10, 3, "Scan to verify");
  const s = k.join("\n"),
    ob = [
      "<</Type/Catalog/Pages 2 0 R>>",
      "<</Type/Pages/Kids[3 0 R]/Count 1>>",
      `<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Contents 7 0 R/Resources<</Font<</F1 4 0 R/F2 5 0 R/F3 6 0 R>>>>>>`,
      "<</Type/Font/Subtype/Type1/BaseFont/Times-Roman>>",
      "<</Type/Font/Subtype/Type1/BaseFont/Times-Bold>>",
      "<</Type/Font/Subtype/Type1/BaseFont/Times-Italic>>",
      `<</Length ${s.length}>>\nstream\n${s}\nendstream`,
    ];
  let out = "%PDF-1.4\n";
  const off = ob.map((b, i) => {
    const p = out.length;
    out += `${i + 1} 0 obj\n${b}\nendobj\n`;
    return p;
  });
  out += `xref\n0 ${ob.length + 1}\n0000000000 65535 f \n${off.map((p) => String(p).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<</Size ${ob.length + 1}/Root 1 0 R>>\nstartxref\n${out.length}\n%%EOF`;
  return Uint8Array.from(out, (ch) => ch.charCodeAt(0) & 255);
}

/* ---------- Issuing, re-issuing, revoking ---------- */
async function issue(d, prevId) {
  need("registrar");
  let s = S.students.find((x) => x.sid === d.sid);
  if (!s)
    S.students.push({
      sid: d.sid,
      name: d.name,
      code: String(Math.floor(1e5 + Math.random() * 9e5)),
    });
  const id =
      prevId ||
      `PUB-${new Date().getFullYear()}-${String(ids().length + 1).padStart(4, "0")}`,
    v = prevId ? last(id).v + 1 : 1;
  const c = { ...d, id, v, date: today(), issuer: me.email, base: base() };
  S.certs.push(c);
  await block("ISSUE", id, await sha(pdf(c)), { v });
  return c;
}
async function evalId(id) {
  const bs = ISS(id);
  if (!bs.length) return { s: "none" };
  const b = bs.at(-1),
    c = row(id, b.v),
    r = REV(id);
  if (r) return { s: "revoked", b, c, r };
  return { s: c && (await sha(pdf(c))) === b.hash ? "valid" : "invalid", b, c };
}
async function evalFile(h) {
  const b = S.chain.find((x) => x.type === "ISSUE" && x.hash === h);
  if (!b)
    return {
      s: "invalid",
      note: "This file does not match any certificate issued by PUB. It was changed, or it is not ours.",
    };
  const c = row(b.certId, b.v),
    r = REV(b.certId);
  return r
    ? { s: "revoked", b, c, r }
    : { s: ISS(b.certId).at(-1).v > b.v ? "outdated" : "valid", b, c };
}

/* ---------- Public verification ---------- */
const MSG = {
  valid: ["Valid", "Matches the record on the blockchain."],
  invalid: ["Invalid", "This certificate was modified after it was issued."],
  revoked: ["Revoked", "The university withdrew this certificate."],
  outdated: ["Outdated", "A corrected version has replaced this one."],
  none: ["Not found", "No certificate with this ID exists on the chain."],
};
const out = (h) => ($("#result").innerHTML = h);
function resHtml(r, priv) {
  const [t, m] = MSG[r.s],
    b = r.b,
    c = r.c,
    q = r.r;
  const d = b
    ? `<dl>${c ? `<dt>Document</dt><dd>${KIND[c.kind]}${priv ? " for " + E(c.name) : ""}</dd>` : ""}<dt>Issued by</dt><dd>${E(b.by)}, PUB University</dd><dt>Issue date</dt><dd>${b.ts.slice(0, 10)}</dd>${q ? `<dt>Revoked</dt><dd>${E(q.reason)}. Co-signed by ${E(q.cosign)}</dd>` : ""}<dt>Transaction</dt><dd><code>${b.tx}</code></dd></dl>`
    : "";
  return `<div class="res ${r.s}"><b>${t}</b><p>${r.note || m}</p>${d}</div>`;
}
const log = (id, r, via, h) =>
  block("VERIFY", id, h || r.b?.hash || "-", { res: r.s, via, by: "verifier" });
async function byId(id, tok, via = "id") {
  id = id.trim();
  let priv = false;
  $("#cid").value = id;
  if (tok) {
    const sh = S.shares.find((x) => x.token === tok && x.id === id);
    if (!sh || sh.rev)
      return out(
        '<div class="res none"><b>Link not valid</b><p>The student stopped sharing this link.</p></div>',
      );
    if (Date.now() > sh.exp)
      return out(
        '<div class="res none"><b>Link expired</b><p>Ask the student for a new verification link.</p></div>',
      );
    priv = true;
    via = "link";
  }
  const r = await evalId(id);
  await log(id, r, via);
  out(resHtml(r, priv));
}
async function byFile(f) {
  const h = await sha(new Uint8Array(await f.arrayBuffer())),
    r = await evalFile(h);
  await log(r.b?.certId || "-", r, "pdf", h);
  out(resHtml(r, true));
}
$("#pdfin").onchange = (e) =>
  e.target.files[0] && run(() => byFile(e.target.files[0]));

/* ---------- Tamper lab: one changed letter breaks the fingerprint ---------- */
const hexDiff = (a, b) =>
  [...b]
    .map((ch, i) => (ch === a[i] ? ch : `<span class="d">${ch}</span>`))
    .join("");
function labRow() {
  return (
    S.certs.find(
      (c) => c.sid === "CSE-2303" && ISS(c.id).at(-1)?.v === c.v && !REV(c.id),
    ) ||
    S.certs.find((c) => ISS(c.id).at(-1)?.v === c.v && !REV(c.id)) ||
    S.certs[0]
  );
}
async function lab() {
  const c = labRow(),
    a = ISS(c.id).at(-1).hash,
    now = await sha(
      pdf({
        ...c,
        name: $("#f-name").value,
        program: $("#f-program").value,
        cgpa: $("#f-cgpa").value,
      }),
    );
  const n = [...now].filter((ch, i) => ch !== a[i]).length,
    ok = now === a;
  $("#h-chain").textContent = a;
  $("#h-now").innerHTML = hexDiff(a, now);
  $(".seal").classList.toggle("bad", !ok);
  const m = $("#labmsg");
  m.className = "verdict " + (ok ? "ok" : "bad");
  m.textContent = ok
    ? "Matches the chain. Valid."
    : `Invalid. ${n} of 64 characters changed.`;
}
function initLab() {
  const c = labRow();
  $("#labkind").textContent = KIND[c.kind];
  $("#labid").textContent = c.id;
  $("#f-name").value = c.name;
  $("#f-program").value = c.program;
  $("#f-cgpa").value = c.cgpa;
  $$("#lab input").forEach((i) => (i.oninput = () => run(lab)));
  return lab();
}

/* ---------- QR scan ---------- */
const stopCam = () => {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  $("#cam").hidden = true;
};
function fromUrl(u) {
  const m = String(u).match(/verify=([^&]+)(?:&t=(\w+))?/);
  if (m) return byId(m[1], m[2], "qr");
  toast("This QR code is not a PUB certificate.");
}

/* ---------- Staff ---------- */
async function renderStaff() {
  const el = $("#staff");
  if (!me) {
    el.innerHTML = `<div class="grid2"><div class="card"><h2>Staff sign in</h2><p>Only issuer accounts approved in the contract can issue or revoke.</p>
   <form data-f="login"><label for="em">Email</label><input id="em" name="em" type="email" required><label for="pw">Password</label><input id="pw" name="pw" type="password" required><button class="btn">Sign in</button></form>
   <p class="hint">Demo registrar: registrar@pub.edu / pub123<br>Demo controller: controller@pub.edu / ctrl123</p></div>
   <div class="card"><h2>Need an issuer account?</h2><p>Send a request. The Controller of Examinations must approve it before you can sign in.</p>
   <form data-f="reg"><label for="re">Email</label><input id="re" name="em" type="email" required><label for="rp">Password (6+ characters)</label><input id="rp" name="pw" type="password" minlength="6" required><button class="btn">Request account</button></form></div></div>`;
    return;
  }
  const reg = me.role === "registrar",
    rows = await Promise.all(
      ids().map(async (id) => ({ id, r: await evalId(id) })),
    );
  const pa = Object.entries(S.accts).filter(([, a]) => a.st === "pending"),
    ia = Object.entries(S.accts).filter(
      ([, a]) => a.role === "registrar" && a.st === "approved",
    );
  el.innerHTML = `<div class="bar"><b>${E(me.email)}</b><span class="chip valid">${me.role === "controller" ? "Controller of Examinations" : "Registrar"}</span><button class="btn sm ghost" data-a="out">Sign out</button></div>
  ${
    reg
      ? `<div class="grid2"><form class="card" data-f="issue"><h2>Issue a certificate</h2>
   <label for="sid">Student ID</label><input id="sid" name="sid" required><label for="nm">Student name</label><input id="nm" name="nm" required>
   <label for="kd">Document</label><select id="kd" name="kind">${Object.entries(
     KIND,
   )
     .map(([k, v]) => `<option value="${k}">${v}</option>`)
     .join("")}</select>
   <label for="pg">Program</label><input id="pg" name="prog" value="B.Sc. in Computer Science and Engineering" required><label for="cg">CGPA</label><input id="cg" name="cgpa" inputmode="decimal" required>
   <label for="co">Courses and grades (transcript only, one per line)</label><textarea id="co" name="courses" rows="3" placeholder="CSE101 Programming, A+"></textarea><button class="btn">Issue to blockchain</button></form>
   <div class="card"><h2>Issue a whole batch</h2><p>CSV columns: studentId, name, program, cgpa, kind (optional: degree, prov, tx)</p>
   <input type="file" id="csvf" accept=".csv,.txt" aria-label="CSV file"><div class="tools"><button class="btn" data-a="batch" type="button">Issue batch</button><button class="btn ghost" data-a="sample" type="button">Download sample CSV</button></div><div id="brep" class="hint"></div></div></div>`
      : ""
  }
  ${
    !reg
      ? `<div class="grid2"><div class="card"><h2>Issuer accounts</h2>${pa.map(([e]) => `<div class="pend"><span>${E(e)} is waiting</span><span class="acts"><button class="btn sm" data-a="appr" data-id="${E(e)}">Approve</button><button class="btn sm ghost" data-a="deny" data-id="${E(e)}">Reject</button></span></div>`).join("") || '<p class="hint">No pending requests.</p>'}
   ${ia.map(([e]) => `<div class="pend"><span>${E(e)}</span><button class="btn sm ghost" data-a="rmv" data-id="${E(e)}">Remove access</button></div>`).join("")}</div>
   <div class="card"><h2>Revocations to co-sign</h2>${S.revq.map((q, i) => `<div class="pend"><span><b>${q.id}</b>: ${E(q.reason)}<small> requested by ${E(q.by)}</small></span><span class="acts"><button class="btn sm bad" data-a="cosign" data-i="${i}">Co-sign</button><button class="btn sm ghost" data-a="nocos" data-i="${i}">Reject</button></span></div>`).join("") || '<p class="hint">Nothing waiting.</p>'}</div></div>`
      : ""
  }
  <div class="card"><h2>All certificates</h2>${rows
    .map(({ id, r }) => {
      const c = last(id),
        pend = S.revq.some((q) => q.id === id);
      return `<div class="t"><b>${id}</b><span>${E(c.name)}<small>${E(c.sid)}${reg ? " · access code " + S.students.find((s) => s.sid === c.sid)?.code : ""}</small></span><span>${KIND[c.kind]}<small>version ${c.v}</small></span><span class="chip ${r.s}">${MSG[r.s][0]}</span>
   <span class="acts"><button class="btn sm ghost" data-a="pdf" data-id="${id}" data-v="${c.v}">PDF</button>${reg && r.s !== "revoked" ? `<button class="btn sm ghost" data-a="fix" data-id="${id}">Correct</button>${pend ? "<small>Revoke pending</small>" : `<button class="btn sm ghost" data-a="rev" data-id="${id}">Revoke</button>`}` : ""}</span></div>`;
    })
    .join("")}</div>`;
}
function openDlg(mode, id, html) {
  const d = $("#dlg");
  d.dataset.m = mode;
  d.dataset.id = id;
  d.innerHTML = `<form method="dialog">${html}<div class="row"><button class="btn" value="ok">Save</button><button class="btn ghost" value="x" formnovalidate>Cancel</button></div></form>`;
  d.returnValue = "";
  d.showModal();
}
$("#dlg").onclose = () =>
  run(async () => {
    const d = $("#dlg"),
      id = d.dataset.id;
    if (d.returnValue !== "ok") return;
    if (d.dataset.m === "rev") {
      need("registrar");
      S.revq.push({ id, reason: $("#why").value.trim(), by: me.email });
      save();
      toast("Sent to the Controller for co-signing.");
    } else {
      const p = last(id);
      await issue(
        {
          sid: p.sid,
          name: $("#xn").value.trim(),
          kind: p.kind,
          program: $("#xp").value.trim(),
          cgpa: $("#xg").value.trim(),
          courses: $("#xc").value,
        },
        id,
      );
      toast(`${id} re-issued as version ${last(id).v}`);
    }
    renderStaff();
  });

/* ---------- Student ---------- */
async function renderStudent() {
  const el = $("#student");
  if (!stu) {
    el.innerHTML = `<div class="card narrow"><h2>Student sign in</h2><p>Use your student ID and the access code from the Registrar.</p><form data-f="slogin"><label for="si">Student ID</label><input id="si" name="sid" required><label for="sc">Access code</label><input id="sc" name="code" required><button class="btn">Sign in</button></form><p class="hint">Demo: CSE-2303 / 123456</p></div>`;
    return;
  }
  const s = S.students.find((x) => x.sid === stu),
    mine = ids().filter((id) => last(id).sid === stu);
  el.innerHTML =
    `<div class="bar"><b>${E(s.name)}</b><span class="chip valid">${E(s.sid)}</span><button class="btn sm ghost" data-a="sout">Sign out</button></div>` +
      (
        await Promise.all(
          mine.map(async (id) => {
            const c = last(id),
              r = await evalId(id),
              sh = S.shares.filter((x) => x.id === id && !x.rev);
            return `<div class="card"><div class="cert"><div><h3>${KIND[c.kind]}</h3><p>${id} · <span class="chip ${r.s}">${MSG[r.s][0]}</span></p></div>
   <div class="acts"><button class="btn sm ghost" data-a="pdf" data-id="${id}" data-v="${c.v}">Download PDF</button><button class="btn sm ghost" data-a="vc" data-id="${id}">Credential JSON</button></div></div>
   <div class="row" style="margin-top:14px"><select id="d-${id}" aria-label="Link lifetime" style="flex:0 0 150px"><option value="3600000">1 hour</option><option value="86400000" selected>24 hours</option><option value="604800000">7 days</option></select><button class="btn sm" data-a="share" data-id="${id}">Create employer link</button></div>
   ${sh
     .map((x) => {
       const u = `${base()}#verify=${id}&t=${x.token}`;
       return `<div class="links"><code>${u}</code>${Date.now() > x.exp ? '<span class="bad-t">expired</span>' : "until " + new Date(x.exp).toLocaleString()}<br><button class="btn sm ghost" data-a="cp" data-u="${u}">Copy</button> <button class="btn sm ghost" data-a="stop" data-t="${x.token}">Stop sharing</button><span class="qr" data-u="${u}"></span></div>`;
     })
     .join("")}</div>`;
          }),
        )
      ).join("") || "<p>No certificates yet.</p>";
  $$(".qr").forEach(
    (e) =>
      window.QRCode &&
      new QRCode(e, { text: e.dataset.u, width: 84, height: 84 }),
  );
}

/* ---------- Audit trail ---------- */
async function renderAudit() {
  const ch = S.chain,
    n = (t) => ch.filter((b) => b.type === t).length,
    vs = ch.filter((b) => b.type === "VERIFY"),
    ok = vs.filter((b) => b.res === "valid").length;
  const q = ($("#aq")?.value || "").toLowerCase(),
    ty = $("#at")?.value || "";
  $("#audit").innerHTML = `<h2>Every issue, revoke and check, in order</h2>
  <div class="stats"><div class="stat"><b>${n("ISSUE")}</b>certificates issued</div><div class="stat"><b>${vs.length}</b>verifications</div><div class="stat"><b>${ok}</b>came back valid</div><div class="stat"><b>${vs.length - ok}</b>rejected</div><div class="stat"><b>${n("REVOKE")}</b>revoked</div></div>
  <div class="tools"><button class="btn sm" data-a="integ">Check chain integrity</button><button class="btn sm ghost" data-a="exp">Export ledger</button><label class="btn sm ghost" for="imp">Import ledger</label><input id="imp" type="file" accept=".json" hidden><button class="btn sm ghost" data-a="reset">Reset demo data</button></div><p id="integ" class="verdict"></p>
  <div class="filters"><input id="aq" placeholder="Search by ID, email or hash" value="${E(q)}" aria-label="Search"><select id="at" aria-label="Event type"><option value="">All events</option>${["ISSUE", "REVOKE", "VERIFY", "ISSUER"].map((t) => `<option ${t === ty ? "selected" : ""}>${t}</option>`).join("")}</select></div>
  <ol class="log">${ch
    .filter(
      (b) =>
        (!ty || b.type === ty) &&
        (!q || JSON.stringify(b).toLowerCase().includes(q)),
    )
    .reverse()
    .map(
      (
        b,
      ) => `<li class="${b.type}"><span class="tag">${b.type}</span><b>${b.certId}</b>${b.type === "ISSUE" ? `version ${b.v}` : b.type === "REVOKE" ? E(b.reason) : b.type === "VERIFY" ? `${b.res} via ${b.via}` : b.act}
   <small>Block ${b.n} · ${b.ts.replace("T", " ").slice(0, 19)} · by ${E(b.by)}${b.cosign ? " · co-signed " + E(b.cosign) : ""}</small><small>Transaction ${b.tx}</small></li>`,
    )
    .join("")}</ol>`;
  $("#aq").oninput = $("#at").onchange = async () => {
    await renderAudit();
    const a = $("#aq");
    a.focus();
    a.setSelectionRange(a.value.length, a.value.length);
  };
  $("#imp").onchange = async (e) =>
    run(async () => {
      S = JSON.parse(await e.target.files[0].text());
      save();
      toast("Ledger imported");
      renderAudit();
    });
}

/* ---------- Forms and clicks ---------- */
const H = {
  lookup: (f) => byId(V(f, "cid")),
  async login(f) {
    const em = V(f, "em").toLowerCase(),
      a = S.accts[em];
    if (!a || a.h !== (await sha(a.salt + f.elements.pw.value)))
      throw Error("Wrong email or password.");
    if (a.st !== "approved")
      throw Error(
        a.st === "pending"
          ? "The Controller has not approved this account yet."
          : "This account no longer has access.",
      );
    me = { email: em, role: a.role };
    renderStaff();
  },
  async reg(f) {
    const em = V(f, "em").toLowerCase();
    if (S.accts[em]) throw Error("This email is already registered.");
    const salt = Math.random().toString(36).slice(2);
    S.accts[em] = {
      role: "registrar",
      salt,
      h: await sha(salt + f.elements.pw.value),
      st: "pending",
    };
    save();
    f.reset();
    toast("Request sent. Wait for the Controller to approve it.");
  },
  async issue(f) {
    const c = await issue({
      sid: V(f, "sid"),
      name: V(f, "nm"),
      kind: V(f, "kind"),
      program: V(f, "prog"),
      cgpa: V(f, "cgpa"),
      courses: f.elements.courses.value,
    });
    toast(`Issued ${c.id}`);
    renderStaff();
  },
  async slogin(f) {
    const s = S.students.find(
      (x) => x.sid === V(f, "sid") && x.code === V(f, "code"),
    );
    if (!s) throw Error("Student ID or access code is wrong.");
    stu = s.sid;
    renderStudent();
  },
};
const A = {
  out() {
    me = null;
    renderStaff();
  },
  sout() {
    stu = null;
    renderStudent();
  },
  pdf(el) {
    dl(
      `${el.dataset.id}.pdf`,
      pdf(row(el.dataset.id, +el.dataset.v)),
      "application/pdf",
    );
  },
  rev(el) {
    openDlg(
      "rev",
      el.dataset.id,
      `<h3>Revoke ${el.dataset.id}</h3><label for="why">Reason</label><input id="why" required><p class="hint">The Controller must co-sign before this takes effect.</p>`,
    );
  },
  fix(el) {
    const c = last(el.dataset.id);
    openDlg(
      "fix",
      c.id,
      `<h3>Correct ${c.id}</h3><p class="hint">This issues a new version. The old PDF will show as Outdated.</p><label for="xn">Name</label><input id="xn" value="${E(c.name)}" required><label for="xp">Program</label><input id="xp" value="${E(c.program)}" required><label for="xg">CGPA</label><input id="xg" value="${E(c.cgpa)}" required><label for="xc">Courses</label><textarea id="xc" rows="3">${E(c.courses)}</textarea>`,
    );
  },
  appr(el) {
    need("controller");
    S.accts[el.dataset.id].st = "approved";
    block("ISSUER", el.dataset.id, "-", { act: "approved as issuer" });
    renderStaff();
  },
  deny(el) {
    need("controller");
    delete S.accts[el.dataset.id];
    save();
    renderStaff();
  },
  rmv(el) {
    need("controller");
    S.accts[el.dataset.id].st = "removed";
    block("ISSUER", el.dataset.id, "-", { act: "issuer access removed" });
    renderStaff();
  },
  async cosign(el) {
    need("controller");
    const q = S.revq[+el.dataset.i],
      b = ISS(q.id).at(-1);
    await block("REVOKE", q.id, b.hash, {
      reason: q.reason,
      cosign: me.email,
      by: q.by,
    });
    S.revq.splice(+el.dataset.i, 1);
    save();
    toast(`${q.id} revoked`);
    renderStaff();
  },
  nocos(el) {
    need("controller");
    S.revq.splice(+el.dataset.i, 1);
    save();
    renderStaff();
  },
  async batch() {
    need("registrar");
    const f = $("#csvf").files[0];
    if (!f) throw Error("Choose a CSV file first.");
    let ok = 0,
      bad = [];
    for (const [i, l] of (await f.text()).split(/\r?\n/).entries()) {
      const [sid, name, program, cgpa, kind = "degree"] = l
        .split(",")
        .map((s) => s.trim());
      if (!l.trim() || /^student/i.test(sid)) continue;
      if (!sid || !name || !program || isNaN(parseFloat(cgpa)) || !KIND[kind]) {
        bad.push(i + 1);
        continue;
      }
      await issue({ sid, name, program, cgpa, kind, courses: "" });
      ok++;
    }
    toast(`${ok} issued${bad.length ? `, ${bad.length} skipped` : ""}`);
    await renderStaff();
    $("#brep").textContent = bad.length
      ? `Skipped lines: ${bad.join(", ")}. Check the columns.`
      : `All ${ok} rows issued.`;
  },
  sample: () =>
    dl(
      "sample-batch.csv",
      "studentId,name,program,cgpa,kind\nCSE-2310,Rafi Hasan,B.Sc. in Computer Science and Engineering,3.45,degree\nCSE-2311,Mim Akter,B.Sc. in Computer Science and Engineering,3.92,degree\n",
      "text/csv",
    ),
  share(el) {
    const id = el.dataset.id;
    S.shares.push({
      id,
      token: Math.random().toString(36).slice(2, 10),
      exp: Date.now() + +$("#d-" + id).value,
      rev: false,
    });
    save();
    renderStudent();
  },
  stop(el) {
    S.shares.find((x) => x.token === el.dataset.t).rev = true;
    save();
    renderStudent();
  },
  cp(el) {
    navigator.clipboard
      .writeText(el.dataset.u)
      .then(() => toast("Link copied"));
  },
  vc(el) {
    const c = last(el.dataset.id),
      b = ISS(c.id).at(-1);
    dl(
      `${c.id}.vc.json`,
      JSON.stringify(
        {
          "@context": ["https://www.w3.org/2018/credentials/v1"],
          type: ["VerifiableCredential", "UniversityCredential"],
          issuer: "did:example:pub-university",
          issuanceDate: b.ts,
          credentialSubject: {
            id: "did:example:" + c.sid,
            name: c.name,
            program: c.program,
            cgpa: c.cgpa,
            document: KIND[c.kind],
          },
          proof: {
            type: "Sha256ChainAnchor",
            certificateId: c.id,
            sha256: b.hash,
            transaction: b.tx,
          },
        },
        null,
        2,
      ),
      "application/json",
    );
  },
  async integ() {
    let p = "0".repeat(64);
    for (const b of S.chain) {
      if (
        b.prev !== p ||
        b.tx !== (await sha(b.prev + b.type + b.certId + b.hash + b.ts))
      ) {
        $("#integ").className = "verdict bad";
        return ($("#integ").textContent = `Chain broken at block ${b.n}.`);
      }
      p = b.tx;
    }
    $("#integ").className = "verdict ok";
    $("#integ").textContent =
      `All ${S.chain.length} blocks are linked and intact.`;
  },
  exp: () => dl("certchain-ledger.json", JSON.stringify(S), "application/json"),
  reset() {
    if (confirm("Delete all demo data and start again?")) {
      localStorage.removeItem("pubcc2");
      location.hash = "";
      location.reload();
    }
  },
  async scan() {
    if (!("BarcodeDetector" in window))
      throw Error(
        "QR scanning needs Chrome or Edge. Type the ID or upload the PDF instead.",
      );
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    const v = $("#cam"),
      d = new BarcodeDetector({ formats: ["qr_code"] });
    v.srcObject = stream;
    v.hidden = false;
    await v.play();
    const loop = async () => {
      if (!stream) return;
      const r = await d.detect(v);
      if (r[0]) {
        stopCam();
        fromUrl(r[0].rawValue);
      } else requestAnimationFrame(loop);
    };
    loop();
  },
};
document.addEventListener("submit", (e) => {
  const n = e.target.dataset.f;
  if (n) {
    e.preventDefault();
    run(() => H[n](e.target));
  }
});
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-a]");
  if (el) run(() => A[el.dataset.a](el));
});

/* ---------- Navigation and boot ---------- */
const R = { staff: renderStaff, student: renderStudent, audit: renderAudit };
function show(v) {
  stopCam();
  $$(".view").forEach((e) => e.classList.toggle("on", e.id === v));
  $$("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
  R[v] && run(R[v]);
  scrollTo(0, 0);
}
$("#nav").onclick = (e) => e.target.dataset.v && show(e.target.dataset.v);
function route() {
  const m = location.hash.match(/^#verify=([^&]+)(?:&t=(\w+))?/);
  if (m) {
    show("verify");
    run(() => byId(m[1], m[2]));
  }
}
async function seed() {
  for (const [em, role, pw] of [
    ["controller@pub.edu", "controller", "ctrl123"],
    ["registrar@pub.edu", "registrar", "pub123"],
  ]) {
    const salt = Math.random().toString(36).slice(2);
    S.accts[em] = { role, salt, h: await sha(salt + pw), st: "approved" };
    await block("ISSUER", em, "-", {
      act: "approved as issuer",
      by: "controller@pub.edu",
    });
  }
  me = { email: "registrar@pub.edu", role: "registrar" };
  const P = "B.Sc. in Computer Science and Engineering";
  await issue({
    sid: "CSE-2303",
    name: "Pollob Kumar",
    kind: "prov",
    program: P,
    cgpa: "3.67",
    courses: "",
  });
  await issue({
    sid: "CSE-2302",
    name: "Tanvir Ahmed",
    kind: "tx",
    program: P,
    cgpa: "3.54",
    courses:
      "CSE101 Programming Fundamentals, A+\nCSE201 Data Structures, A\nCSE301 Database Systems, A-\nCSE401 Machine Learning, B+",
  });
  await issue({
    sid: "CSE-2301",
    name: "Nusrat Jahan",
    kind: "degree",
    program: P,
    cgpa: "3.81",
    courses: "",
  });
  const x = await issue({
    sid: "CSE-2304",
    name: "Sample Revoked",
    kind: "degree",
    program: "B.Sc. in Electrical Engineering",
    cgpa: "3.10",
    courses: "",
  });
  await block("REVOKE", x.id, ISS(x.id)[0].hash, {
    reason: "Issued in error: wrong program",
    cosign: "controller@pub.edu",
  });
  S.students.forEach((s) => (s.code = "123456"));
  me = null;
  save();
}
(async () => {
  try {
    if (!S.certs.length || S.certs[0]?.sid !== "CSE-2303") {
      S = {
        accts: {},
        students: [],
        certs: [],
        chain: [],
        shares: [],
        revq: [],
      };
      await seed();
    }
    await initLab();
    $(".seal").classList.add("in");
    addEventListener("hashchange", route);
    route();
  } catch (x) {
    toast(x.message);
  }
})();
