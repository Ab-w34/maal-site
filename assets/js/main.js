/* ---------------- evidence viewer data ---------------- */
const FIELDS = [
  { k_ar:"رقم السجل التجاري", k_en:"Commercial registration",
    v:"1010••••••", file:"contract.pdf", loc:"p.3 · l.12", conflict:true,
    tag_ar:"يختلف عن أمر الشراء", tag_en:"Differs from the purchase order",
    lines:[["10","الطرف الأول: مؤسسة البناء المتقدم"],
           ["11","العنوان: المدينة المنورة — طريق الملك عبدالله"],
           ["12","سجل تجاري رقم <bdi>1010••••••</bdi> وتاريخ <bdi>1445/03/18</bdi>هـ"],
           ["13","ويمثلها في التوقيع المدير العام."]],
    hit:2,
    note_ar:"أمر الشراء يحمل <bdi>4030••••••</bdi> لنفس المنشأة — أُبلغ الفريق.",
    note_en:"The purchase order carries 4030•••••• for the same entity — flagged to the team." },

  { k_ar:"الرقم الضريبي", k_en:"VAT number",
    v:"3••••••••••••03", file:"vat_certificate.pdf", loc:"p.1 · l.7", conflict:false,
    lines:[["5","المملكة العربية السعودية — هيئة الزكاة والضريبة والجمارك"],
           ["6","شهادة تسجيل في ضريبة القيمة المضافة"],
           ["7","الرقم الضريبي: <bdi>3••••••••••••03</bdi>"],
           ["8","تاريخ سريان التسجيل: <bdi>2024/01/01</bdi>م"]],
    hit:2,
    note_ar:"مطابق للرقم الوارد في العقد وفي أمر الشراء.",
    note_en:"Matches the number in both the contract and the purchase order." },

  { k_ar:"اسم المنشأة", k_en:"Entity name",
    v:"مؤسسة البناء المتقدم", arValue:true, file:"cr_certificate.pdf", loc:"p.1 · l.4", conflict:false,
    lines:[["2","وزارة التجارة — شهادة السجل التجاري"],
           ["3","نوع الكيان: مؤسسة فردية"],
           ["4","الاسم التجاري: مؤسسة البناء المتقدم للمقاولات"],
           ["5","النشاط: تشييد المباني السكنية وغير السكنية"]],
    hit:2,
    note_ar:"الاسم متطابق عبر المستندات الأربعة.",
    note_en:"The name is consistent across all four documents." },

  { k_ar:"قيمة أمر الشراء", k_en:"Purchase order value",
    v:"SAR 2,480,000", file:"purchase_order.pdf", loc:"p.2 · l.19", conflict:false,
    lines:[["17","بند 4 — أعمال الخرسانة المسلحة"],
           ["18","الكمية: حسب الجداول المرفقة"],
           ["19","الإجمالي شامل الضريبة: <bdi>2,480,000</bdi> ريال سعودي"],
           ["20","مدة التنفيذ: <bdi>180</bdi> يومًا من تاريخ الاستلام"]],
    hit:2,
    note_ar:"مطابق للقيمة الواردة في ملحق العقد.",
    note_en:"Matches the value in the contract annex." }
];

let lang = "ar";
let sel = 0;

const fieldsEl = document.getElementById("fields");
const srcFile  = document.getElementById("srcFile");
const srcLoc   = document.getElementById("srcLoc");
const srcLines = document.getElementById("srcLines");
const srcNote  = document.getElementById("srcNote");
const reduce   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderFields(animate){
  fieldsEl.innerHTML = "";
  FIELDS.forEach((f,i)=>{
    const b = document.createElement("button");
    b.className = "field" + (f.conflict ? " conflict" : "");
    b.setAttribute("aria-selected", i===sel ? "true" : "false");
    if (animate && !reduce){ b.classList.add("reveal"); b.style.animationDelay = (i*110)+"ms"; }
    const tag = f.conflict
      ? '<span class="tag">' + (lang==="ar"?f.tag_ar:f.tag_en) + '</span>'
      : '';
    const val = f.arValue
      ? '<div class="v ar-val">'+f.v+'</div>'
      : '<div class="v"><bdi dir="ltr">'+f.v+'</bdi></div>';
    b.innerHTML = '<div class="k">'+(lang==="ar"?f.k_ar:f.k_en)+'</div>' + val + tag;
    b.addEventListener("click", ()=>{ sel = i; renderFields(false); renderSource(); });
    fieldsEl.appendChild(b);
  });
}

function renderSource(){
  const f = FIELDS[sel];
  srcFile.textContent = f.file;
  srcLoc.textContent  = f.loc;
  srcLines.innerHTML  = f.lines.map((l,i)=>
    '<div class="ln"><span class="no">'+l[0]+'</span><span'+(i===f.hit?' class="hit"':'')+'>'+l[1]+'</span></div>'
  ).join("");
  srcNote.innerHTML = lang==="ar" ? f.note_ar : f.note_en;
}

/* ---------------- language toggle ---------------- */
const langBtn = document.getElementById("langBtn");
function setLang(next){
  lang = next;
  const html = document.documentElement;
  html.lang = next;
  html.dir   = next === "ar" ? "rtl" : "ltr";
  langBtn.textContent = next === "ar" ? "English" : "العربية";
  document.querySelectorAll("[data-ar]").forEach(el=>{
    const t = el.getAttribute(next === "ar" ? "data-ar" : "data-en");
    if (t !== null) el.textContent = t;
  });
  renderFields(false);
  renderSource();
}
langBtn.addEventListener("click", ()=> setLang(lang === "ar" ? "en" : "ar"));

/* ---------------- mobile nav ---------------- */
const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");
navToggle.addEventListener("click", ()=>{
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
navLinks.addEventListener("click", e=>{
  if (e.target.tagName === "A"){ navLinks.classList.remove("open"); navToggle.setAttribute("aria-expanded","false"); }
});

/* ---------------- contact form ----------------
   Submissions are forwarded to maalscore@gmail.com by Web3Forms.
   PASTE YOUR ACCESS KEY ON THE NEXT LINE, between the quotes.          */
const WEB3FORMS_KEY = "6e169928-caaf-4c91-97c2-63a4318e1949";

const sendBtn = document.getElementById("sendBtn");
const sendOk  = document.getElementById("sendOk");

sendBtn.addEventListener("click", async ()=>{
  const email = document.getElementById("fe").value.trim();
  if (!email || !email.includes("@")){ document.getElementById("fe").focus(); return; }

  const original = sendBtn.textContent;
  sendBtn.disabled = true;
  sendBtn.textContent = lang === "ar" ? "جارٍ الإرسال..." : "Sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject:    "MAAL — pilot request from the website",
        from_name:  "MAAL website",
        name:         document.getElementById("fn").value.trim(),
        organisation: document.getElementById("fo").value.trim(),
        email:        email,
        message:      document.getElementById("fm").value.trim()
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "send failed");

    sendOk.style.display = "block";
    ["fn","fo","fe","fm"].forEach(id => document.getElementById(id).value = "");
  } catch (err) {
    // Never show a success message for a request that did not arrive.
    sendOk.style.display = "none";
    alert(lang === "ar"
      ? "تعذّر إرسال الطلب. راسلنا مباشرة على maalscore@gmail.com"
      : "Could not send. Please email us directly at maalscore@gmail.com");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = original;
  }
});

renderFields(true);
renderSource();
