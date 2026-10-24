import type { Locale } from "./i18n/config";

export type Section = { h: string; p?: string[]; list?: string[] };
export type ContentPage = { title: string; intro: string; sections: Section[]; note?: string };

type Key = "how" | "about" | "trust" | "terms" | "privacy";

const LEGAL_NOTE_EN =
  "Draft for development. This document has not been reviewed by a lawyer and must be finalized before Wadajir Give accepts real donations.";
const LEGAL_NOTE_SO =
  "Qabyo horumarin ah. Dukumentigan weli qareen ma eegin, waana in la dhammaystiraa ka hor inta aan Wadajir Give aqbalin deeqo dhab ah. Nuqulka Ingiriisiga ayaa ah kan sharci ahaan go'aaminaya; turjumaad Soomaali ah oo buuxda ayaa la diyaarinayaa.";

const terms: ContentPage = {
  title: "Terms of service",
  intro: "These terms describe how Wadajir Give works and the responsibilities of organizers, donors and the platform.",
  sections: [
    { h: "What Wadajir Give is", p: ["Wadajir Give is an online platform that lets people raise money (\"organizers\") and give money (\"donors\") for personal, family, community and religious causes. Wadajir Give is not a charity, bank or money transmitter, and does not itself provide the goods or services that fundraisers describe."] },
    { h: "Organizer responsibilities", list: [
      "Provide accurate, complete information and keep it up to date.",
      "Have permission from the beneficiary to raise money on their behalf.",
      "Use funds only for the purpose described in the fundraiser.",
      "Provide documents to support the fundraiser when we ask.",
      "Comply with all laws that apply to you, including tax reporting.",
    ] },
    { h: "Review, verification and removal", p: ["Every fundraiser is reviewed before it is published. We may decline, pause or remove a fundraiser, hold or reverse payouts, and suspend accounts when we believe information is false, a law or these terms are being broken, or donors are at risk."] },
    { h: "Donations", p: [
      "Donations are processed by our payment provider, Stripe. Donations to personal fundraisers are gifts to individuals and are generally not tax-deductible. Wadajir Give does not guarantee that a fundraiser will reach its goal or that funds will be used as described, but we investigate every report.",
      "Donors may add an optional tip to Wadajir Give. Tips are separate from the donation and are not refundable once a payout has been made, except where required by law.",
    ] },
    { h: "Fees", p: ["Wadajir Give does not charge organizers a platform fee. Payment processing fees set by our payment provider are deducted from donations before payout."] },
    { h: "Payouts", p: ["During the initial launch, payouts are available only to organizers who can connect an eligible US bank account through our payment provider and pass its identity checks. Payout timing is set by the payment provider. Payouts may be held during an investigation."] },
    { h: "Refunds", p: ["Donors who believe a donation was made in error or that a fundraiser is fraudulent should contact us. Refund decisions are made case by case and are subject to our payment provider's rules."] },
    { h: "Prohibited uses", list: [
      "Fundraisers for illegal activity, violence, weapons or hate.",
      "Raising money for a person without their permission.",
      "Misrepresenting a personal fundraiser as a registered charity or as tax-deductible.",
      "Using Wadajir Give to move money for purposes other than the stated cause.",
    ] },
    { h: "Changes and contact", p: ["We may update these terms and will post the new version here. Questions can be sent through the Contact page."] },
  ],
};

const privacy: ContentPage = {
  title: "Privacy policy",
  intro: "This policy explains what information Wadajir Give collects, why, and the choices you have.",
  sections: [
    { h: "Information we collect", list: [
      "Account details: name, email address, and optionally phone number and country.",
      "Fundraiser content: stories, photos, beneficiary details and updates you publish.",
      "Donation details: amount, tip, donor name and email, message, and whether you chose to give anonymously.",
      "Payment information is collected and stored by Stripe, not by Wadajir Give. We receive only payment status and references.",
      "Basic technical data such as IP address, used to prevent abuse and keep the service secure.",
    ] },
    { h: "How we use it", list: [
      "To run the service: accounts, fundraisers, donations, receipts and payouts.",
      "To review fundraisers and prevent fraud and abuse.",
      "To contact you about your account, donations or fundraisers.",
      "To meet legal obligations.",
    ] },
    { h: "What is public", p: ["Published fundraisers, organizer names, updates and donor names with donation amounts are public, unless the donor chose to give anonymously. Donor email addresses are never shown publicly."] },
    { h: "Who we share it with", p: ["We share information with service providers that help us run Wadajir Give (hosting, database, payments, email), with the organizer of a fundraiser you donate to (your name, amount and message, and your email unless restricted), and with authorities where the law requires it. We do not sell personal information."] },
    { h: "Your choices", p: ["You can update your profile in Account settings, and contact us to access or delete your data. Some records, such as donation records, must be kept for legal and accounting reasons."] },
    { h: "Security", p: ["We use access controls in our database so people can only see the information they are allowed to see, and we never store full card numbers."] },
  ],
};

const pages: Record<Locale, Record<Key, ContentPage>> = {
  en: {
    how: {
      title: "Giving, made *simple.*",
      intro: "Wadajir Give is built around the way our community already gives: through family, friends and the masjid. Here's what happens from the first step to the payout.",
      sections: [
        { h: "For organizers", list: [
          "Create an account and start a fundraiser. Tell the story, set a goal in US dollars and add a photo.",
          "Submit it for review. A person on our team reads every fundraiser, usually within two business days, and may ask for supporting documents.",
          "Once approved, share the link on WhatsApp, Facebook and in family group chats.",
          "Post updates so donors know how the money is being used.",
          "Connect a US bank account through our payment provider to receive payouts.",
        ] },
        { h: "For donors", list: [
          "Browse approved fundraisers by cause or search by city.",
          "Choose an amount and, if you wish, a tip for Wadajir Give. A tip of zero is fine.",
          "Pay securely on Stripe's payment page. You'll get a receipt by email.",
          "Give anonymously if you prefer; your name is then hidden from the public.",
        ] },
        { h: "Fees", p: ["No platform fee for organizers. The payment provider's card processing fee is deducted from each donation. Optional tips from donors keep Wadajir Give running."] },
        { h: "Where payouts go", p: ["At launch, payouts go to organizers with a US bank account. Organizers raising money for people in Somalia or elsewhere are responsible for sending funds on through a licensed remittance service. We're working to support more countries safely."] },
      ],
    },
    about: {
      title: "Wadajir means *together.*",
      intro: "Wadajir means \"together\" in Somali. We're building a fundraising home for Somali communities in North America, Europe, East Africa and everywhere in between.",
      sections: [
        { h: "Why we exist", p: [
          "When someone in our community is sick, passes away, or needs help, the response is immediate: a WhatsApp message, a collection at the masjid, a cousin who tracks who gave what. That generosity is a strength, but it is hard to see where money goes, and scammers take advantage.",
          "Wadajir Give keeps the speed and warmth of community giving and adds review, verification, receipts and a clear record of every donation.",
        ] },
        { h: "What we believe", list: [
          "Every fundraiser should be checked by a person before strangers are asked to give.",
          "Badges, totals and statistics should only appear when they're true.",
          "Somali speakers deserve a first-class experience, not a translation afterthought.",
          "Fees should be clear and small.",
        ] },
        { h: "Status", p: ["Wadajir Give is a working name for a platform in development. It is not a registered charity."] },
      ],
    },
    trust: {
      title: "Built to be *trusted.*",
      intro: "Giving should feel safe. These are the protections built into Wadajir Give, and what they do and don't promise.",
      sections: [
        { h: "Review before publishing", p: ["No fundraiser is visible to the public until a reviewer approves it. Reviewers check that the story is specific, that the organizer appears to have permission, and that the purpose is allowed. We may ask for documents such as a hospital letter or funeral home invoice."] },
        { h: "Verified organizers", p: ["Organizers can request identity verification. The \"Verified organizer\" badge appears only after our team has confirmed the organizer's identity. It does not mean we have confirmed every detail of the story."] },
        { h: "Reporting", p: ["Every live fundraiser has a \"Report this fundraiser\" link. Reports go to our review team, who can pause the fundraiser and hold payouts while they investigate."] },
        { h: "Payments", p: ["Card payments are handled by Stripe. Wadajir Give never sees or stores full card numbers. Donations are recorded only after Stripe confirms the payment."] },
        { h: "Spotting a scam", list: [
          "Be careful if someone asks you to send money directly by mobile transfer instead of through the fundraiser.",
          "Check that the organizer explains their relationship to the beneficiary.",
          "Look for updates and specific details rather than urgent, vague appeals.",
          "If something feels wrong, report it. You don't need to be certain.",
        ] },
      ],
    },
    terms,
    privacy,
  },
  so: {
    how: {
      title: "Deeq, si *fudud.*",
      intro: "Wadajir Give waxaa loo dhisay sida bulshadeennu horeba u deeqdo: qoyska, saaxiibada iyo masaajidka. Waa kan waxa dhaca laga bilaabo tallaabada koowaad ilaa lacag-bixinta.",
      sections: [
        { h: "Qabanqaabiyeyaasha", list: [
          "Samee akoon oo bilow olole. Sheeg sheekada, deji hadaf doollar ah oo ku dar sawir.",
          "U dir dib-u-eegis. Qof kooxdayada ka mid ah ayaa akhriya olole kasta, badanaa laba maalmood oo shaqo gudahood, wuxuuna weydiin karaa dukumentiyo taageero ah.",
          "Marka la ansixiyo, link-ga la wadaag WhatsApp, Facebook iyo kooxaha qoyska.",
          "Daabac warar cusub si deeq-bixiyeyaashu u ogaadaan sida lacagta loo isticmaalayo.",
          "Ku xir akoon bangi oo Maraykan ah shirkadda lacag-bixinta si aad lacagta u hesho.",
        ] },
        { h: "Deeq-bixiyeyaasha", list: [
          "Baadh ololeyaasha la ansixiyey adoo u kala saaraya ujeeddo ama magaalo.",
          "Dooro qaddar, haddii aad rabtona abaal-marin Wadajir Give ah. Eber waa caadi.",
          "Si ammaan ah ugu bixi bogga lacag-bixinta ee Stripe. Rasiid ayaad iimayl ku heli doontaa.",
          "Haddii aad doorbidayso, si qarsoodi ah u deeq; magacaaga dadweynaha waa laga qarinayaa.",
        ] },
        { h: "Khidmadaha", p: ["Khidmad goob ah lagama qaado qabanqaabiyeyaasha. Khidmadda kaarka ee shirkadda lacag-bixinta ayaa laga jarayaa deeq kasta. Abaal-marinta ikhtiyaariga ah ee deeq-bixiyeyaasha ayaa Wadajir Give socodsiisa."] },
        { h: "Meesha lacagtu aaddo", p: ["Bilowga, lacag-bixintu waxay u socotaa qabanqaabiyeyaasha leh akoon bangi oo Maraykan ah. Qabanqaabiyeyaasha u ururinaya dad Soomaaliya ama meel kale jooga ayaa mas'uul ka ah u gudbinta lacagta iyagoo adeegsanaya adeeg xawaalad oo shati leh. Waxaan ka shaqaynaynaa inaan si ammaan ah u taageerno dalal kale."] },
      ],
    },
    about: {
      title: "Wadajir macnaheedu waa *wada jir.*",
      intro: "Wadajir waxay ka dhigan tahay \"together\". Waxaan u dhisaynaa guri lacag-ururin bulshooyinka Soomaaliyeed ee Waqooyiga Ameerika, Yurub, Bariga Afrika iyo meel kasta oo u dhexeysa.",
      sections: [
        { h: "Sababta aan u jirno", p: [
          "Marka qof bulshadeenna ka mid ahi bukoodo, geeriyoodo, ama caawimaad u baahdo, jawaabtu waa degdeg: fariin WhatsApp ah, ururin masaajidka, ina-adeer qora cidda wax bixisay. Deeqsinimadaasi waa awood, laakiin way adag tahay in la ogaado meesha lacagtu aaddo, khayaanayaashuna way ka faa'iidaystaan.",
          "Wadajir Give waxay haysaa xawaaraha iyo diirrimaadka deeqda bulshada, waxayna ku daraysaa dib-u-eegis, xaqiijin, rasiidyo iyo diiwaan cad oo deeq kasta.",
        ] },
        { h: "Waxa aan aaminsannahay", list: [
          "Olole kasta waa in qof hubiyaa ka hor inta aan dad aan la aqoon laga codsan inay wax bixiyaan.",
          "Calaamadaha, wadarta iyo tirakoobyadu waa inay soo baxaan keliya marka ay run yihiin.",
          "Ku hadlayaasha af Soomaaliga waxay mudan yihiin khibrad heer sare ah, ma aha turjumaad dambe.",
          "Khidmaduhu waa inay cad yihiin oo yar yihiin.",
        ] },
        { h: "Xaaladda", p: ["Wadajir Give waa magac shaqo oo loogu talagalay goob weli la dhisayo. Ma aha hay'ad samafal oo diiwaangashan."] },
      ],
    },
    trust: {
      title: "Loo dhisay in la *aamino.*",
      intro: "Deeqdu waa inay dareemto ammaan. Kuwani waa ilaalinta ku dhex jirta Wadajir Give, iyo waxa ay ballan qaadaan iyo waxa aysan ballan qaadin.",
      sections: [
        { h: "Dib-u-eegis ka hor daabacaadda", p: ["Olole dadweynaha uma muuqdo ilaa dib-u-eegaye ansixiyo. Dib-u-eegayaashu waxay hubiyaan in sheekadu gaar tahay, in qabanqaabiyuhu u muuqdo inuu ogolaansho haysto, iyo in ujeeddadu la oggol yahay. Waxaan weydiin karnaa dukumentiyo sida warqad isbitaal ama qaansheegad aas."] },
        { h: "Qabanqaabiyeyaal la xaqiijiyey", p: ["Qabanqaabiyeyaashu waxay codsan karaan xaqiijin aqoonsi. Calaamadda \"Qabanqaabiye la xaqiijiyey\" waxay soo baxdaa keliya marka kooxdayadu xaqiijiso aqoonsiga qabanqaabiyaha. Macnaheedu ma aha inaan xaqiijinnay faahfaahin kasta oo sheekada ah."] },
        { h: "Soo sheegid", p: ["Olole kasta oo firfircoon wuxuu leeyahay link \"Soo sheeg ololahan\". Warbixinnadu waxay gaaraan kooxda dib-u-eegista, kuwaas oo hakin kara ololaha iyo lacag-bixinta inta ay baarayaan."] },
        { h: "Lacag-bixinta", p: ["Lacag-bixinta kaarka waxaa maamula Stripe. Wadajir Give marnaba ma arko mana kaydiso lambarrada kaarka oo dhammaystiran. Deeqaha waxaa la diiwaangeliyaa keliya marka Stripe xaqiijiyo lacag-bixinta."] },
        { h: "Sida loo garto khayaano", list: [
          "Taxaddar haddii qof kaa codsado inaad lacag si toos ah ugu dirto mobile halkii aad ololaha ka mari lahayd.",
          "Hubi in qabanqaabiyuhu sharxo xiriirka uu la leeyahay qofka loo ururinayo.",
          "Raadi warar cusub iyo faahfaahin gaar ah halkii ay ka ahaan lahaayeen codsiyo degdeg ah oo aan caddayn.",
          "Haddii wax khaldan yihiin, soo sheeg. Uma baahnid inaad hubiso.",
        ] },
      ],
    },
    terms: { ...terms, note: LEGAL_NOTE_SO },
    privacy: { ...privacy, note: LEGAL_NOTE_SO },
  },
};

export function getContent(locale: Locale, key: Key): ContentPage {
  const page = pages[locale][key];
  if (locale === "en" && (key === "terms" || key === "privacy")) return { ...page, note: LEGAL_NOTE_EN };
  return page;
}
